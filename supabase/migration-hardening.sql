-- ============================================================================
-- F.I.R.E — Security hardening migration
-- Run AFTER schema.sql (and migration-features / -portfolio / -admin.sql),
-- in the Supabase SQL editor. Safe to re-run (idempotent).
--   • stops students from promoting themselves to admin
--   • keeps approval / feature / member-count flags in admin hands
--   • makes public portfolios actually show their activities
--   • lets club leaders read their own club roster
--   • dedupes + uniquely indexes club membership
--   • ties analytics events to the real caller and gates submissions server-side
--   • adds the indexes the app filters on
-- ============================================================================

-- ----------------------------------------------------------------------------
-- HELPER: may the caller write moderation-controlled columns?
-- ----------------------------------------------------------------------------
-- Deliberately NOT security definer: current_user has to stay the caller's
-- role. PostgREST runs requests as 'anon'/'authenticated', so anything else
-- (service-role key, psql, the SQL editor) is a trusted back-office session.
create or replace function public.is_privileged_writer()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select public.is_admin()
      or coalesce(auth.role(), '') = 'service_role'
      or current_user not in ('anon', 'authenticated');
$$;

-- ============================================================================
-- 1 — Privilege escalation on public.users
--   RLS limits which ROW may be updated, never which COLUMNS, so a student
--   could update({ role: 'admin' }) on their own row.
-- ============================================================================

create or replace function public.guard_user_privileges()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if public.is_privileged_writer() then
    return new;
  end if;
  if new.role is distinct from old.role
     or new.id is distinct from old.id
     or new.email is distinct from old.email then
    raise exception 'Only an admin can change a user''s role, id or email'
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;

drop trigger if exists users_guard_privileges on public.users;
create trigger users_guard_privileges
  before update on public.users
  for each row execute function public.guard_user_privileges();

-- ============================================================================
-- 2 — Moderation bypass on competitions and clubs
--   Any logged-in user could insert a competition and then approve/feature it
--   through the owner-update policy; club leaders could self-approve a club
--   and hand-write member_count.
-- ============================================================================

-- Only club leaders and admins may list a competition (students use /submit,
-- which writes to community_submissions).
drop policy if exists "auth insert comp" on public.competitions;
drop policy if exists "leader insert comp" on public.competitions;
create policy "leader insert comp" on public.competitions
  for insert with check (
    public.is_club_leader()
    and (submitted_by = auth.uid() or public.is_admin())
    and (public.is_admin() or (is_approved = false and is_featured = false))
  );

-- Same for clubs: a leader creates a club pending approval, never approved, and
-- with an empty roster — sync_club_member_count() owns member_count from there,
-- so a hand-written starting count would only ever be fake social proof.
drop policy if exists "leader insert club" on public.clubs;
create policy "leader insert club" on public.clubs
  for insert with check (
    (public.is_club_leader() and leader_id = auth.uid() or public.is_admin())
    and (public.is_admin() or (is_approved = false and member_count = 0))
  );

create or replace function public.guard_competition_moderation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if public.is_privileged_writer() then
    return new;
  end if;
  if new.is_approved is distinct from old.is_approved
     or new.is_featured is distinct from old.is_featured then
    raise exception 'Only an admin can approve or feature a competition'
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;

drop trigger if exists competitions_guard_moderation on public.competitions;
create trigger competitions_guard_moderation
  before update on public.competitions
  for each row execute function public.guard_competition_moderation();

create or replace function public.guard_club_moderation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Depth > 1 means we were reached from sync_club_member_count(), which has
  -- to keep member_count in step when a student joins or leaves a club.
  if public.is_privileged_writer() or pg_trigger_depth() > 1 then
    return new;
  end if;
  if new.is_approved is distinct from old.is_approved
     or new.member_count is distinct from old.member_count then
    raise exception 'Only an admin can approve a club or change its member count'
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;

drop trigger if exists clubs_guard_moderation on public.clubs;
create trigger clubs_guard_moderation
  before update on public.clubs
  for each row execute function public.guard_club_moderation();

-- ============================================================================
-- 3 — Public portfolios showed no activities
--   The old inline subquery ran as the calling role, so "users read own or
--   admin" hid every other user and visitors saw an empty portfolio.
-- ============================================================================

create or replace function public.has_public_portfolio(uid uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.users where id = uid and is_portfolio_public = true
  );
$$;

grant execute on function public.has_public_portfolio(uuid) to anon, authenticated;

drop policy if exists "activities public portfolio" on public.custom_activities;
create policy "activities public portfolio" on public.custom_activities
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or public.has_public_portfolio(user_id)
  );

-- ============================================================================
-- 4 — Club leaders could not see their own roster
--   participation only had own-row + admin select policies, and the joined
--   users rows were hidden by "users read own or admin".
-- ============================================================================

-- "clubs read approved" already lets a leader see their own club even while it
-- is unapproved, so this subquery is safe to run as the caller.
drop policy if exists "participation leader read club" on public.participation;
create policy "participation leader read club" on public.participation
  for select using (
    club_id is not null
    and club_id in (select id from public.clubs where leader_id = auth.uid())
  );

-- Roster with the safe-to-share profile fields only (same set as
-- public.competition_teammates). Leaders of that club and admins only.
create or replace function public.club_members(club uuid)
returns table(
  user_id   uuid,
  full_name text,
  school    text,
  grade     text,
  status    participation_status,
  joined_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select p.user_id, u.full_name, u.school, u.grade, p.status, p.created_at
  from public.participation p
  join public.users u on u.id = p.user_id
  where p.club_id = club
    and (
      public.is_admin()
      or exists (
        select 1 from public.clubs c where c.id = club and c.leader_id = auth.uid()
      )
    )
  order by p.created_at desc;
$$;

grant execute on function public.club_members(uuid) to authenticated;

-- ============================================================================
-- 5 — Club membership had no uniqueness (the table only covers competitions)
-- ============================================================================

-- Drop duplicates first (keeping the earliest join) or the index cannot build.
delete from public.participation p
using public.participation q
where p.club_id is not null
  and q.club_id = p.club_id
  and q.user_id = p.user_id
  and (q.created_at < p.created_at
       or (q.created_at = p.created_at and q.id < p.id));

create unique index if not exists idx_part_user_club
  on public.participation (user_id, club_id)
  where club_id is not null;

-- ============================================================================
-- 6 — analytics_events accepted forged rows from the anon key
-- ============================================================================

drop policy if exists "analytics insert any" on public.analytics_events;
drop policy if exists "analytics insert self" on public.analytics_events;
create policy "analytics insert self" on public.analytics_events
  for insert with check (
    case when auth.uid() is null then user_id is null else user_id = auth.uid() end
  );

-- ============================================================================
-- 7 — The admin "allow submissions" switch was client-side only
-- ============================================================================

-- site_settings is world-readable today, but a definer helper keeps the policy
-- working even if that ever tightens.
create or replace function public.submissions_open()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce((select allow_submissions from public.site_settings where id = 1), true);
$$;

grant execute on function public.submissions_open() to anon, authenticated;

-- 'pending' is forced too: anything else would land straight in the reviewed
-- tabs of the admin queue without an admin ever having looked at it.
drop policy if exists "subs insert any" on public.community_submissions;
drop policy if exists "subs insert when open" on public.community_submissions;
create policy "subs insert when open" on public.community_submissions
  for insert with check (public.submissions_open() and status = 'pending');

-- ============================================================================
-- 8 — Indexes for the columns the app filters on constantly
-- ============================================================================

create index if not exists idx_part_club       on public.participation(club_id);
create index if not exists idx_part_comp       on public.participation(competition_id);
create index if not exists idx_activities_user on public.custom_activities(user_id);

-- ============================================================================
-- 9 — Retention for the public-write analytics table
-- ============================================================================

-- OPTIONAL, NOT SCHEDULED. analytics_events is insert-only and world-writable,
-- so trim it by hand (or from a cron job) once it gets large:
--
--   delete from public.analytics_events where created_at < now() - interval '180 days';
