-- ============================================================================
-- Student notes (landing-page sticky-note wall)
-- Students write short notes; admins review them; approved notes render on
-- the public landing page. Idempotent — safe to re-run.
-- Run AFTER migration-hardening.sql (relies on public.is_admin()).
-- ============================================================================

create table if not exists public.student_notes (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  -- Snapshot of the author's display name/school at write time. The landing
  -- page reads this table anonymously, and anon can't join public.users
  -- (its RLS is self/admin only), so the attribution must live on the row.
  author_name   text not null,
  author_school text,
  body          text not null check (char_length(body) between 1 and 280),
  status        submission_status not null default 'pending',
  admin_notes   text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_notes_status on public.student_notes(status);
create index if not exists idx_notes_user   on public.student_notes(user_id);

alter table public.student_notes enable row level security;

-- Anon landing-page readers see approved notes only; students see their own;
-- admins see everything.
drop policy if exists "notes read" on public.student_notes;
create policy "notes read" on public.student_notes
  for select using (status = 'approved' or user_id = auth.uid() or public.is_admin());

-- Students insert their own notes, forced to start pending.
drop policy if exists "notes insert own pending" on public.student_notes;
create policy "notes insert own pending" on public.student_notes
  for insert with check (auth.uid() = user_id and status = 'pending');

-- Only admins change status / admin_notes. Students have NO update policy, so
-- self-approval is impossible.
drop policy if exists "notes admin update" on public.student_notes;
create policy "notes admin update" on public.student_notes
  for update using (public.is_admin()) with check (public.is_admin());

-- Students may retract a note that hasn't been reviewed yet; admins any note.
drop policy if exists "notes delete own pending" on public.student_notes;
create policy "notes delete own pending" on public.student_notes
  for delete using ((user_id = auth.uid() and status = 'pending') or public.is_admin());
