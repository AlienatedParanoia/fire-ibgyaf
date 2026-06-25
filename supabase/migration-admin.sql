-- ============================================================================
-- F.I.R.E — Admin control migration
-- Run AFTER schema.sql + migration-features.sql, in the Supabase SQL editor.
-- Safe to re-run (idempotent).
--
-- PR 1 — Image uploads
--   • public "media" storage bucket for admin-managed images
--     (club logos/banners, competition banners, user avatars)
-- ============================================================================

-- Storage bucket for admin-managed media.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone can view media (public bucket, but be explicit).
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

-- Only admins may upload/replace/remove media.
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
