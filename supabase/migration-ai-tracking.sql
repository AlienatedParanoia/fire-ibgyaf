-- ============================================================================
-- F.I.R.E — Interaction tracking, popularity and personalised recommendations
-- (ported from the Lovable app). Idempotent / safe to re-run.
-- Run AFTER schema.sql and migration-hardening.sql.
-- ============================================================================

-- ---- user_interactions: what each signed-in student viewed / saved / joined ---
create table if not exists public.user_interactions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  item_type    text not null check (item_type in ('club','competition')),
  item_id      uuid not null,
  action_type  text not null check (action_type in ('view','click','save','register','join')),
  created_at   timestamptz not null default now()
);
create index if not exists idx_interactions_user      on public.user_interactions(user_id, created_at desc);
create index if not exists idx_interactions_item      on public.user_interactions(item_type, item_id);
create index if not exists idx_interactions_created   on public.user_interactions(created_at desc);

alter table public.user_interactions enable row level security;

drop policy if exists "interactions insert own" on public.user_interactions;
create policy "interactions insert own" on public.user_interactions
  for insert with check (user_id = auth.uid());

drop policy if exists "interactions read own or admin" on public.user_interactions;
create policy "interactions read own or admin" on public.user_interactions
  for select using (user_id = auth.uid() or public.is_admin());

-- Optional retention (not scheduled): delete from public.user_interactions where created_at < now() - interval '180 days';

-- ---- item_popularity: aggregated, publicly readable --------------------------
create table if not exists public.item_popularity (
  item_type            text not null check (item_type in ('club','competition')),
  item_id              uuid not null,
  total_views          integer not null default 0,
  total_clicks         integer not null default 0,
  total_saves          integer not null default 0,
  total_registrations  integer not null default 0,
  popularity_score     numeric not null default 0,
  last_calculated      timestamptz not null default now(),
  primary key (item_type, item_id)
);
create index if not exists idx_popularity_score on public.item_popularity(popularity_score desc);

alter table public.item_popularity enable row level security;

drop policy if exists "popularity read" on public.item_popularity;
create policy "popularity read" on public.item_popularity for select using (true);
-- No write policies: only aggregate_popularity() (below) writes this table.

-- Rebuilds the table from the last 30 days of interactions. Called daily by
-- /api/cron/popularity with the service-role key.
create or replace function public.aggregate_popularity()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.item_popularity;
  insert into public.item_popularity
    (item_type, item_id, total_views, total_clicks, total_saves, total_registrations, popularity_score, last_calculated)
  select
    item_type, item_id,
    count(*) filter (where action_type = 'view'),
    count(*) filter (where action_type = 'click'),
    count(*) filter (where action_type = 'save'),
    count(*) filter (where action_type in ('register','join')),
    count(*) filter (where action_type = 'view')
      + 2 * count(*) filter (where action_type = 'click')
      + 4 * count(*) filter (where action_type = 'save')
      + 6 * count(*) filter (where action_type in ('register','join')),
    now()
  from public.user_interactions
  where created_at > now() - interval '30 days'
  group by item_type, item_id;
end;
$$;
revoke all on function public.aggregate_popularity() from public, anon, authenticated;

-- ---- recommendations ---------------------------------------------------------
-- Scores approved clubs / open competitions for the CALLER (auth.uid()):
--   behaviour   what they viewed, clicked, saved or joined (capped)
--   interest    category matches their chosen interests
--   affinity    categories of other things they engaged with
--   popularity  how much other students engage with it
--   recency     newer listings get a small boost
-- Anything they already joined / saved is left out.
create or replace function public.get_recommendations(p_item_type text, p_limit integer default 12)
returns table(item_id uuid, total_score numeric, reasons text[])
language plpgsql
stable
security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  my_interests text[];
begin
  if uid is null then
    return;
  end if;
  if p_item_type not in ('club','competition') then
    raise exception 'item type must be club or competition';
  end if;

  select coalesce(u.interests, '{}') into my_interests from public.users u where u.id = uid;

  return query
  with behaviour as (
    select ui.item_id as iid,
           least(sum(case ui.action_type
             when 'view' then 1 when 'click' then 2 when 'save' then 4
             when 'register' then 6 when 'join' then 6 else 0 end), 20)::numeric as s
      from public.user_interactions ui
     where ui.user_id = uid and ui.item_type = p_item_type
     group by ui.item_id
  ),
  engaged as (
    select c.category as cat,
           (case ui.action_type when 'view' then 1 when 'click' then 2 when 'save' then 4 else 6 end)::numeric as w
      from public.user_interactions ui
      join public.clubs c on ui.item_type = 'club' and c.id = ui.item_id
     where ui.user_id = uid
    union all
    select k.category,
           (case ui.action_type when 'view' then 1 when 'click' then 2 when 'save' then 4 else 6 end)::numeric
      from public.user_interactions ui
      join public.competitions k on ui.item_type = 'competition' and k.id = ui.item_id
     where ui.user_id = uid
  ),
  affinity as (
    select cat, sum(w) as w from engaged where cat is not null group by cat
  ),
  candidates as (
    select c.id as iid, c.category, c.created_at
      from public.clubs c
     where p_item_type = 'club' and c.is_approved
       and not exists (select 1 from public.participation p where p.user_id = uid and p.club_id = c.id)
    union all
    select k.id, k.category, k.created_at
      from public.competitions k
     where p_item_type = 'competition' and k.is_approved
       and (k.deadline is null or k.deadline >= current_date)
       and not exists (select 1 from public.participation p where p.user_id = uid and p.competition_id = k.id)
  ),
  scored as (
    select cd.iid,
           coalesce(b.s, 0)                                                     as beh,
           case when cd.category = any(my_interests) then 8 else 0 end::numeric  as inte,
           least(coalesce(a.w, 0) * 0.5, 10)                                     as aff,
           least(coalesce(ip.popularity_score, 0), 50) / 5                       as pop,
           greatest(0, 1 - extract(epoch from (now() - cd.created_at)) / (30 * 86400)) * 6 as rec,
           cd.category
      from candidates cd
      left join behaviour b          on b.iid = cd.iid
      left join affinity a           on a.cat = cd.category
      left join public.item_popularity ip on ip.item_type = p_item_type and ip.item_id = cd.iid
  )
  select s.iid,
         round(s.beh + s.inte + s.aff + s.pop + s.rec, 2),
         array_remove(array[
           case when s.inte > 0 then 'Matches your interest in ' || s.category end,
           case when s.aff  > 0 and s.inte = 0 then 'Similar to things you looked at' end,
           case when s.pop  >= 3 then 'Popular with students lately' end,
           case when s.rec  >= 4 then 'Recently added' end
         ], null)
    from scored s
   order by (s.beh + s.inte + s.aff + s.pop + s.rec) desc, s.iid
   limit greatest(1, least(p_limit, 50));
end;
$$;
revoke all on function public.get_recommendations(text, integer) from public, anon;
grant execute on function public.get_recommendations(text, integer) to authenticated;
