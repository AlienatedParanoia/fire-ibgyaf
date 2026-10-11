-- ============================================================================
-- F.I.R.E — Admin audit log, role requests, club team roles
-- (ported from the Lovable app). Idempotent / safe to re-run.
-- Run AFTER schema.sql, migration-features.sql (notifications) and
-- migration-hardening.sql (is_privileged_writer guard).
-- ============================================================================

-- ---- admin audit log ---------------------------------------------------------
create table if not exists public.admin_audit_log (
  id           uuid primary key default uuid_generate_v4(),
  actor_id     uuid references public.users(id) on delete set null,
  action       text not null,
  target_type  text,
  target_id    text,
  details      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists idx_audit_created on public.admin_audit_log(created_at desc);
create index if not exists idx_audit_actor   on public.admin_audit_log(actor_id);

alter table public.admin_audit_log enable row level security;

drop policy if exists "audit admin read" on public.admin_audit_log;
create policy "audit admin read" on public.admin_audit_log
  for select using (public.is_admin());

-- Admins may only write entries as themselves; nobody can edit or delete history.
drop policy if exists "audit admin insert" on public.admin_audit_log;
create policy "audit admin insert" on public.admin_audit_log
  for insert with check (public.is_admin() and actor_id = auth.uid());

-- ---- role requests -----------------------------------------------------------
-- Students ask to become club leaders. Only admins can approve (admin promotion
-- stays an admin-initiated action from the Users tab, so it is not requestable).
create table if not exists public.role_requests (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.users(id) on delete cascade,
  requested_role  text not null default 'club_leader' check (requested_role = 'club_leader'),
  club_id         uuid references public.clubs(id) on delete set null,
  message         text check (message is null or char_length(message) <= 500),
  status          text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by     uuid references public.users(id) on delete set null,
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now()
);
-- One open request per person.
create unique index if not exists uq_role_requests_one_pending
  on public.role_requests(user_id) where status = 'pending';

alter table public.role_requests enable row level security;

drop policy if exists "role_requests read" on public.role_requests;
create policy "role_requests read" on public.role_requests
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "role_requests insert own" on public.role_requests;
create policy "role_requests insert own" on public.role_requests
  for insert with check (user_id = auth.uid() and status = 'pending' and reviewed_by is null);

drop policy if exists "role_requests withdraw own" on public.role_requests;
create policy "role_requests withdraw own" on public.role_requests
  for delete using (user_id = auth.uid() and status = 'pending');

-- Approving/rejecting goes through this function so the request, the role change,
-- the club assignment, the notification and the audit entry happen atomically.
create or replace function public.review_role_request(p_id uuid, p_approve boolean)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  r public.role_requests;
begin
  if not public.is_admin() then
    raise exception 'Admins only' using errcode = 'insufficient_privilege';
  end if;

  select * into r from public.role_requests where id = p_id and status = 'pending' for update;
  if not found then
    raise exception 'Request not found or already reviewed';
  end if;

  update public.role_requests
     set status = case when p_approve then 'approved' else 'rejected' end,
         reviewed_by = auth.uid(), reviewed_at = now()
   where id = p_id;

  if p_approve then
    -- Never demote an admin who happened to file a request.
    update public.users set role = 'club_leader' where id = r.user_id and role = 'student';
    if r.club_id is not null then
      update public.clubs set leader_id = r.user_id where id = r.club_id and leader_id is null;
    end if;
  end if;

  insert into public.notifications (user_id, type, title, body, link)
  values (
    r.user_id, 'role_request',
    case when p_approve then 'You''re now a club leader 🎉' else 'Club leader request declined' end,
    case when p_approve then 'Open your Club Dashboard to manage your club.' else null end,
    case when p_approve then '/club-leader' else null end
  );

  insert into public.admin_audit_log (actor_id, action, target_type, target_id, details)
  values (
    auth.uid(),
    case when p_approve then 'role_request.approve' else 'role_request.reject' end,
    'user', r.user_id::text,
    jsonb_build_object('request_id', p_id, 'club_id', r.club_id)
  );
end;
$$;
revoke all on function public.review_role_request(uuid, boolean) from public, anon;
grant execute on function public.review_role_request(uuid, boolean) to authenticated;

-- ---- club team roles ---------------------------------------------------------
-- Structured leadership list shown on a club's page (in addition to the
-- president / vice president text fields). Holders are stored by name so
-- people without an account can be listed.
create table if not exists public.club_roles (
  id            uuid primary key default uuid_generate_v4(),
  club_id       uuid not null references public.clubs(id) on delete cascade,
  display_name  text not null check (char_length(display_name) between 1 and 120),
  role          text not null check (role in ('leader','officer','core','bod','member')),
  title         text check (title is null or char_length(title) <= 80),
  assigned_by   uuid references public.users(id) on delete set null,
  created_at    timestamptz not null default now()
);
create index if not exists idx_club_roles_club on public.club_roles(club_id);

alter table public.club_roles enable row level security;

-- Visible whenever the club itself is visible (the subquery runs under clubs' RLS).
drop policy if exists "club_roles read" on public.club_roles;
create policy "club_roles read" on public.club_roles
  for select using (exists (select 1 from public.clubs c where c.id = club_id));

drop policy if exists "club_roles manage" on public.club_roles;
create policy "club_roles manage" on public.club_roles
  for all
  using (public.is_admin() or exists (select 1 from public.clubs c where c.id = club_id and c.leader_id = auth.uid()))
  with check (public.is_admin() or exists (select 1 from public.clubs c where c.id = club_id and c.leader_id = auth.uid()));
