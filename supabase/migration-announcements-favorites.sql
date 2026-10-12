-- ============================================================================
-- F.I.R.E — Announcements + Favorites (ported from the Lovable app)
-- Idempotent / safe to re-run. Run AFTER schema.sql and migration-hardening.sql.
-- ============================================================================

-- ---- announcements -----------------------------------------------------------
-- Admins publish directly. Club leaders can submit, but their rows are forced to
-- 'pending' by the RLS check and only appear publicly once an admin approves them.
create table if not exists public.announcements (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null check (char_length(title) between 1 and 160),
  content     text not null check (char_length(content) between 1 and 2000),
  priority    text not null default 'medium' check (priority in ('low','medium','high')),
  status      text not null default 'pending' check (status in ('pending','approved','rejected')),
  author_id   uuid references public.users(id) on delete set null,
  club_id     uuid references public.clubs(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists idx_announcements_status_created on public.announcements(status, created_at desc);

alter table public.announcements enable row level security;

drop policy if exists "announcements read" on public.announcements;
create policy "announcements read" on public.announcements
  for select using (status = 'approved' or author_id = auth.uid() or public.is_admin());

drop policy if exists "announcements insert" on public.announcements;
create policy "announcements insert" on public.announcements
  for insert with check (
    public.is_admin()
    or (public.is_club_leader() and author_id = auth.uid() and status = 'pending')
  );

drop policy if exists "announcements admin update" on public.announcements;
create policy "announcements admin update" on public.announcements
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "announcements admin delete" on public.announcements;
create policy "announcements admin delete" on public.announcements
  for delete using (public.is_admin() or (author_id = auth.uid() and status = 'pending'));

-- ---- favorites ---------------------------------------------------------------
-- One table for both kinds of saved item. item_id is deliberately not a foreign
-- key (it points at clubs OR competitions); orphans are filtered out on read.
create table if not exists public.favorites (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  item_type   text not null check (item_type in ('club','competition')),
  item_id     uuid not null,
  created_at  timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);
create index if not exists idx_favorites_user on public.favorites(user_id);

alter table public.favorites enable row level security;

drop policy if exists "favorites own" on public.favorites;
create policy "favorites own" on public.favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
