-- ============================================================================
-- F.I.R.E — Feature roadmap migration
-- Run AFTER schema.sql, in the Supabase SQL editor. Safe to re-run.
--
-- Phase 1 — Personalized "For You" feed
--   • adds a per-user list of interest categories used to rank competitions
-- ============================================================================

-- Phase 1: user interests -----------------------------------------------------
alter table public.users add column if not exists interests text[] not null default '{}';

-- ============================================================================
-- Phase 2 — Social proof + Find-a-teammate
--   • aggregate interest counts (bypasses owner-only participation RLS, no PII)
--   • teammate sign-ups so students can team up for a competition
-- ============================================================================

-- Social proof: per-competition tracker counts, callable by anyone (no PII).
create or replace function public.competition_interest_counts()
returns table(competition_id uuid, n bigint)
language sql
stable
security definer
set search_path = public
as $$
  select competition_id, count(*)::bigint as n
  from public.participation
  where competition_id is not null
  group by competition_id;
$$;

grant execute on function public.competition_interest_counts() to anon, authenticated;

-- Find-a-teammate: students opt in to be discoverable for a competition.
create table if not exists public.teammate_signups (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  competition_id uuid not null references public.competitions(id) on delete cascade,
  message        text,
  created_at     timestamptz not null default now(),
  unique (user_id, competition_id)
);

create index if not exists teammate_signups_competition_idx
  on public.teammate_signups (competition_id);

alter table public.teammate_signups enable row level security;

-- Any logged-in student can see who's looking (so they can team up)...
drop policy if exists "teammate read auth" on public.teammate_signups;
create policy "teammate read auth" on public.teammate_signups
  for select to authenticated using (true);

-- ...but only manage their own sign-up.
drop policy if exists "teammate insert own" on public.teammate_signups;
create policy "teammate insert own" on public.teammate_signups
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "teammate delete own" on public.teammate_signups;
create policy "teammate delete own" on public.teammate_signups
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- Discoverable teammates for a competition, with the safe-to-share profile
-- fields (same fields already public via public_portfolios). Authenticated only.
create or replace function public.competition_teammates(comp uuid)
returns table(
  user_id    uuid,
  full_name  text,
  school     text,
  grade      text,
  message    text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select t.user_id, u.full_name, u.school, u.grade, t.message, t.created_at
  from public.teammate_signups t
  join public.users u on u.id = t.user_id
  where t.competition_id = comp
  order by t.created_at desc;
$$;

grant execute on function public.competition_teammates(uuid) to authenticated;

-- ============================================================================
-- Phase 4 — Deadline reminders + notification center
--   • per-user email reminder preference
--   • in-app notifications (owner-readable; inserted by the service-role cron)
--   • reminders_sent dedup ledger (service-role only)
-- ============================================================================

-- Per-user toggle for deadline reminder emails.
alter table public.users add column if not exists email_reminders boolean not null default true;

-- In-app notifications.
create table if not exists public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  type       text not null default 'info',
  title      text not null,
  body       text,
  link       text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

-- Students read and mark-read their own notifications. Inserts come from the
-- service-role cron job (which bypasses RLS), so there is no insert policy.
drop policy if exists "notifications read own" on public.notifications;
create policy "notifications read own" on public.notifications
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "notifications update own" on public.notifications;
create policy "notifications update own" on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Dedup ledger so a given (participation, lead-time) reminder is sent once.
-- Touched only by the service-role cron — RLS on with no policies locks it down.
create table if not exists public.reminders_sent (
  id               uuid primary key default uuid_generate_v4(),
  participation_id uuid not null references public.participation(id) on delete cascade,
  days_before      int not null,
  sent_at          timestamptz not null default now(),
  unique (participation_id, days_before)
);

alter table public.reminders_sent enable row level security;
