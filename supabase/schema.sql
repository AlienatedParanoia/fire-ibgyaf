-- ============================================================================
-- F.I.R.E — Find. Involve. Reach. Engage.
-- Full database schema + Row Level Security (RLS) policies
-- Run this in the Supabase SQL Editor (or `supabase db push`).
-- ============================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('student', 'club_leader', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type comp_format as enum ('online', 'onsite', 'hybrid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type comp_region as enum ('Singapore', 'Global', 'Both');
exception when duplicate_object then null; end $$;

do $$ begin
  create type participation_status as enum ('interested', 'registered', 'participated', 'won');
exception when duplicate_object then null; end $$;

do $$ begin
  create type event_type as enum ('competition', 'club', 'custom');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_type as enum ('competition', 'club');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- TABLES
-- ----------------------------------------------------------------------------

-- users (profile table — mirrors auth.users via trigger) ---------------------
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  full_name   text,
  school      text,
  grade       text,
  role        user_role not null default 'student',
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- clubs ----------------------------------------------------------------------
create table if not exists public.clubs (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  description      text,
  category         text,
  meeting_schedule text,
  contact_email    text,
  contact_person   text,
  logo_url         text,
  banner_url       text,
  leader_id        uuid references public.users(id) on delete set null,
  is_approved      boolean not null default false,
  member_count     integer not null default 0,
  created_at       timestamptz not null default now()
);

-- competitions ---------------------------------------------------------------
create table if not exists public.competitions (
  id                uuid primary key default uuid_generate_v4(),
  title             text not null,
  description       text,
  category          text,
  organizer         text,
  deadline          date,
  event_date        date,
  eligibility       text,
  registration_link text,
  prize             text,
  format            comp_format default 'online',
  region            comp_region default 'Singapore',
  banner_url        text,
  club_id           uuid references public.clubs(id) on delete set null,
  submitted_by      uuid references public.users(id) on delete set null,
  is_approved       boolean not null default false,
  is_featured       boolean not null default false,
  created_at        timestamptz not null default now()
);

-- participation --------------------------------------------------------------
create table if not exists public.participation (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  competition_id uuid references public.competitions(id) on delete cascade,
  club_id        uuid references public.clubs(id) on delete cascade,
  status         participation_status not null default 'interested',
  notes          text,
  created_at     timestamptz not null default now(),
  unique (user_id, competition_id)
);

-- custom_activities ----------------------------------------------------------
create table if not exists public.custom_activities (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  title       text not null,
  description text,
  date        date,
  category    text,
  notes       text,
  created_at  timestamptz not null default now()
);

-- calendar_events ------------------------------------------------------------
create table if not exists public.calendar_events (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  title        text not null,
  event_type   event_type not null default 'custom',
  reference_id uuid,
  date         date not null,
  reminder     boolean not null default false,
  created_at   timestamptz not null default now()
);

-- analytics_events -----------------------------------------------------------
create table if not exists public.analytics_events (
  id           uuid primary key default uuid_generate_v4(),
  event_type   text not null,
  user_id      uuid references public.users(id) on delete set null,
  reference_id uuid,
  metadata     jsonb default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

-- community_submissions ------------------------------------------------------
create table if not exists public.community_submissions (
  id                 uuid primary key default uuid_generate_v4(),
  submitted_by_name  text not null,
  submitted_by_email text not null,
  type               submission_type not null,
  title              text not null,
  description        text,
  category           text,
  deadline           date,
  registration_link  text,
  organizer          text,
  eligibility        text,
  status             submission_status not null default 'pending',
  admin_notes        text,
  created_at         timestamptz not null default now()
);

-- Helpful indexes ------------------------------------------------------------
create index if not exists idx_comp_approved   on public.competitions(is_approved);
create index if not exists idx_comp_deadline    on public.competitions(deadline);
create index if not exists idx_comp_category     on public.competitions(category);
create index if not exists idx_clubs_approved    on public.clubs(is_approved);
create index if not exists idx_part_user        on public.participation(user_id);
create index if not exists idx_cal_user          on public.calendar_events(user_id);
create index if not exists idx_subs_status       on public.community_submissions(status);
create index if not exists idx_analytics_created on public.analytics_events(created_at);

-- ----------------------------------------------------------------------------
-- TRIGGER: auto-create a public.users row when a new auth user signs up
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, school, grade, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'school', ''),
    coalesce(new.raw_user_meta_data->>'grade', ''),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- HELPER: is the current user an admin? (avoids recursive RLS on users)
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_club_leader()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role in ('club_leader','admin')
  );
$$;

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.users                 enable row level security;
alter table public.clubs                 enable row level security;
alter table public.competitions          enable row level security;
alter table public.participation         enable row level security;
alter table public.custom_activities     enable row level security;
alter table public.calendar_events       enable row level security;
alter table public.analytics_events      enable row level security;
alter table public.community_submissions enable row level security;

-- ---- users -----------------------------------------------------------------
drop policy if exists "users read own or admin" on public.users;
create policy "users read own or admin" on public.users
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "users update own" on public.users;
create policy "users update own" on public.users
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "admin manage users" on public.users;
create policy "admin manage users" on public.users
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- clubs -----------------------------------------------------------------
drop policy if exists "clubs read approved" on public.clubs;
create policy "clubs read approved" on public.clubs
  for select using (is_approved = true or leader_id = auth.uid() or public.is_admin());

drop policy if exists "leader insert club" on public.clubs;
create policy "leader insert club" on public.clubs
  for insert with check (public.is_club_leader() and leader_id = auth.uid() or public.is_admin());

drop policy if exists "leader update own club" on public.clubs;
create policy "leader update own club" on public.clubs
  for update using (leader_id = auth.uid() or public.is_admin())
  with check (leader_id = auth.uid() or public.is_admin());

drop policy if exists "admin delete club" on public.clubs;
create policy "admin delete club" on public.clubs
  for delete using (leader_id = auth.uid() or public.is_admin());

-- ---- competitions ----------------------------------------------------------
drop policy if exists "comp read approved" on public.competitions;
create policy "comp read approved" on public.competitions
  for select using (is_approved = true or submitted_by = auth.uid() or public.is_admin());

drop policy if exists "auth insert comp" on public.competitions;
create policy "auth insert comp" on public.competitions
  for insert with check (auth.uid() is not null and (submitted_by = auth.uid() or public.is_admin()));

drop policy if exists "leader update own comp" on public.competitions;
create policy "leader update own comp" on public.competitions
  for update using (submitted_by = auth.uid() or public.is_admin())
  with check (submitted_by = auth.uid() or public.is_admin());

drop policy if exists "leader delete own comp" on public.competitions;
create policy "leader delete own comp" on public.competitions
  for delete using (submitted_by = auth.uid() or public.is_admin());

-- ---- participation (own rows only) -----------------------------------------
drop policy if exists "participation own" on public.participation;
create policy "participation own" on public.participation
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid());

-- ---- custom_activities (own rows only) -------------------------------------
drop policy if exists "activities own" on public.custom_activities;
create policy "activities own" on public.custom_activities
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid());

-- ---- calendar_events (own rows only) ---------------------------------------
drop policy if exists "calendar own" on public.calendar_events;
create policy "calendar own" on public.calendar_events
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid());

-- ---- analytics_events ------------------------------------------------------
drop policy if exists "analytics insert any" on public.analytics_events;
create policy "analytics insert any" on public.analytics_events
  for insert with check (true);

drop policy if exists "analytics admin read" on public.analytics_events;
create policy "analytics admin read" on public.analytics_events
  for select using (public.is_admin());

-- ---- community_submissions (anyone insert, admin read/update) --------------
drop policy if exists "subs insert any" on public.community_submissions;
create policy "subs insert any" on public.community_submissions
  for insert with check (true);

drop policy if exists "subs admin read" on public.community_submissions;
create policy "subs admin read" on public.community_submissions
  for select using (public.is_admin());

drop policy if exists "subs admin update" on public.community_submissions;
create policy "subs admin update" on public.community_submissions
  for update using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- REALTIME — expose tables to the realtime publication
-- ----------------------------------------------------------------------------
do $$ begin
  alter publication supabase_realtime add table public.competitions;
exception when others then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.analytics_events;
exception when others then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.community_submissions;
exception when others then null; end $$;
