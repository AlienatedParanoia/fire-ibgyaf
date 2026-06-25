# Pending Supabase steps

Running checklist of every Supabase change introduced by the feature roadmap.
**Nothing here has been run yet** — run it all at the end in the Supabase dashboard → SQL Editor.
Everything is idempotent (safe to re-run). You can either paste each block, or just run the whole
consolidated file `supabase/migration-features.sql`.

Legend: ⬜ not run yet · ✅ done

---

## ⬜ Phase 1 — Personalized "For You" feed
Adds a per-user list of interest categories used to rank the competitions feed.

```sql
alter table public.users add column if not exists interests text[] not null default '{}';
```

Source: `supabase/migration-features.sql`

---

## ⬜ Phase 2 — Social proof + Find-a-teammate
Adds an aggregate interest-count function (no PII, bypasses owner-only participation RLS),
a `teammate_signups` table with RLS, and a function returning discoverable teammates per
competition. Run the full Phase 2 block from `supabase/migration-features.sql` (it's the
section headed "Phase 2 — Social proof + Find-a-teammate"), which creates:

- `competition_interest_counts()` — function, granted to anon + authenticated
- `teammate_signups` — table + index + RLS policies
- `competition_teammates(uuid)` — function, granted to authenticated

Source: `supabase/migration-features.sql`

---

<!-- Future phases will be appended below as they're built:
## ⬜ Phase 3 — Portfolio PDF export   (no DB changes expected)
## ⬜ Phase 4 — Reminders + notifications
-->
