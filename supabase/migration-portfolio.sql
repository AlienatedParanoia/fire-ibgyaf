-- ============================================================================
-- F.I.R.E — Portfolio feature migration
-- Run AFTER schema.sql, in the Supabase SQL editor. Safe to re-run.
--   • adds image_url (proof) to custom_activities
--   • adds a per-user public/private portfolio flag
--   • exposes a privacy-safe public view (no email) for shared portfolios
--   • opens read access to activities of users with a public portfolio
--   • creates a public Storage bucket "proofs" for image uploads
-- ============================================================================

-- 1. Columns -----------------------------------------------------------------
alter table public.custom_activities add column if not exists image_url text;
alter table public.users add column if not exists is_portfolio_public boolean not null default false;

-- 2. Public, privacy-safe view (only the fields safe to share) ---------------
create or replace view public.public_portfolios as
  select id, full_name, school, grade
  from public.users
  where is_portfolio_public = true;

grant select on public.public_portfolios to anon, authenticated;

-- 3. Allow reading activities that belong to a public portfolio --------------
drop policy if exists "activities public portfolio" on public.custom_activities;
create policy "activities public portfolio" on public.custom_activities
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or user_id in (select id from public.users where is_portfolio_public = true)
  );

-- 4. Storage bucket for proof images -----------------------------------------
insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', true)
on conflict (id) do nothing;

-- Public read (bucket is public, but be explicit)
drop policy if exists "proofs public read" on storage.objects;
create policy "proofs public read" on storage.objects
  for select using (bucket_id = 'proofs');

-- Authenticated users may write only inside their own uid/ folder
drop policy if exists "proofs owner insert" on storage.objects;
create policy "proofs owner insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'proofs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "proofs owner update" on storage.objects;
create policy "proofs owner update" on storage.objects
  for update to authenticated
  using (bucket_id = 'proofs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "proofs owner delete" on storage.objects;
create policy "proofs owner delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'proofs' and (storage.foldername(name))[1] = auth.uid()::text);
