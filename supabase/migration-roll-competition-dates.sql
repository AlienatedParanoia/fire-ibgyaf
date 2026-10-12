-- ============================================================================
-- F.I.R.E — Roll expired competition dates forward
-- Every listed competition currently has a deadline in the past (they were seeded
-- with dates relative to when the seed ran), so the finder shows them all as closed
-- and For You / the chatbot have nothing open to suggest.
--
-- This moves each past deadline (and its event date, if any) forward by whole years
-- to its next yearly occurrence. That is an APPROXIMATION — most of these run
-- annually, but the real dates for the new cycle may differ. Check the official sites
-- and correct the ones that matter in Admin → Manage Competitions.
-- ============================================================================

-- 1. Preview.
select title, deadline,
       (deadline + make_interval(years => greatest(1, ceil((current_date - deadline) / 365.25)::int)))::date as new_deadline
  from public.competitions
 where deadline is not null and deadline < current_date
 order by deadline;

-- 2. Apply.
with shift as (
  select id, greatest(1, ceil((current_date - deadline) / 365.25)::int) as yrs
    from public.competitions
   where deadline is not null and deadline < current_date
)
update public.competitions c
   set deadline   = (c.deadline + make_interval(years => s.yrs))::date,
       event_date = case when c.event_date is null then null
                         else (c.event_date + make_interval(years => s.yrs))::date end
  from shift s
 where c.id = s.id;
