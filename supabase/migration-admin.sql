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

-- ============================================================================
-- PR 2 — Full user editing + club-member management
--   • let admins manage participation rows for any user
--   • keep clubs.member_count in sync with club participation automatically
-- ============================================================================

-- Admins can create/update/delete participation for anyone (the existing
-- "participation own" policy only allows users to manage their own rows).
drop policy if exists "participation admin manage" on public.participation;
create policy "participation admin manage" on public.participation
  for all using (public.is_admin()) with check (public.is_admin());

-- Recompute clubs.member_count from participation whenever club membership changes.
create or replace function public.sync_club_member_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (TG_OP = 'DELETE') then
    if OLD.club_id is not null then
      update public.clubs set member_count =
        (select count(*) from public.participation where club_id = OLD.club_id)
        where id = OLD.club_id;
    end if;
    return OLD;
  else
    if NEW.club_id is not null then
      update public.clubs set member_count =
        (select count(*) from public.participation where club_id = NEW.club_id)
        where id = NEW.club_id;
    end if;
    return NEW;
  end if;
end;
$$;

drop trigger if exists participation_member_count on public.participation;
create trigger participation_member_count
  after insert or delete on public.participation
  for each row execute function public.sync_club_member_count();

-- ============================================================================
-- PR 3 — Participation admin + notification composer
--   • let admins create notifications for any user (compose/broadcast)
-- ============================================================================

drop policy if exists "notifications admin insert" on public.notifications;
create policy "notifications admin insert" on public.notifications
  for insert to authenticated with check (public.is_admin());

-- ============================================================================
-- PR 4 — Persistent platform settings
--   • single-row settings table (replaces the localStorage stub)
-- ============================================================================

create table if not exists public.site_settings (
  id                int primary key default 1 check (id = 1),
  site_name         text not null default 'F.I.R.E',
  tagline           text not null default 'Your gateway to every opportunity',
  contact_email     text,
  allow_submissions boolean not null default true,
  updated_at        timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- Anyone can read settings (e.g. the /submit gate); only admins can change them.
drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select using (true);

drop policy if exists "settings admin update" on public.site_settings;
create policy "settings admin update" on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());
