-- ============================================================================
-- F.I.R.E — Remove the original placeholder seed clubs
-- These five came from supabase/seed.sql (fixed ids 11111111-0000-…-0001 to 0005);
-- the real GIIS clubs from the Lovable app replace them.
--
-- Deleting a club also deletes its memberships (participation rows, ON DELETE
-- CASCADE) and its team roles; competitions that pointed at it keep existing with
-- club_id set to null. Run the preview first.
--
-- NOT included: "Chess Strategy Club" (91d2301f-…) — it was added separately, so
-- decide on that one by hand in Admin → Manage Clubs.
-- ============================================================================

-- 1. Preview: what will be removed, and how many members each has.
select c.id, c.name, count(p.id) as memberships
  from public.clubs c
  left join public.participation p on p.club_id = c.id
 where c.id in (
   '11111111-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000004',
   '11111111-0000-0000-0000-000000000005'
 )
 group by c.id, c.name
 order by c.name;

-- 2. Delete them.
delete from public.clubs
 where id in (
   '11111111-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000004',
   '11111111-0000-0000-0000-000000000005'
 );
