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

## ✅ Phase 3 — Portfolio PDF export
No Supabase changes — uses existing `custom_activities` + `participation` data and the
browser's native print-to-PDF. Nothing to run.

---

## ⬜ Phase 4 — Reminders + notification center
Run the **Phase 4** block from `supabase/migration-features.sql`, which creates:

- `users.email_reminders` boolean column (default true)
- `notifications` table + index + RLS (read/update own)
- `reminders_sent` dedup table (RLS on, service-role only)

**Also required (not SQL) — set these in Vercel → Project → Settings → Environment Variables:**
- `SUPABASE_SERVICE_ROLE_KEY` — service-role key (Supabase → Settings → API)
- `RESEND_API_KEY` — from resend.com (emails are skipped if unset; in-app notifications still work)
- `CRON_SECRET` — any long random string; the cron route requires it
- `REMINDER_FROM_EMAIL` — e.g. `F.I.R.E <reminders@yourdomain>` (optional; falls back to Resend's test sender)
- `NEXT_PUBLIC_SITE_URL` — e.g. `https://fire-ibgyaf.vercel.app` (used in email links)

The daily cron is configured in `vercel.json` (`/api/cron/reminders`).
