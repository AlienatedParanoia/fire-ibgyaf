-- ============================================================================
-- F.I.R.E — Feature roadmap migration
-- Run AFTER schema.sql, in the Supabase SQL editor. Safe to re-run.
--
-- Phase 1 — Personalized "For You" feed
--   • adds a per-user list of interest categories used to rank competitions
-- ============================================================================

-- Phase 1: user interests -----------------------------------------------------
alter table public.users add column if not exists interests text[] not null default '{}';
