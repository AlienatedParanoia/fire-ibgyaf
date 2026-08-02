# Pending Supabase migrations

SQL that has been written but **not yet run** against the live Supabase project.
Run these (Supabase Studio → SQL Editor, or `psql`) when ready, then tick them off.

| Status | File | What it does |
| --- | --- | --- |
| ⬜ pending | `migration-hardening.sql` | **Run this first.** Closes a critical privilege-escalation hole plus the moderation, portfolio, roster, uniqueness and public-write gaps found in the security audit. Idempotent → safe to re-run. |
| ⬜ pending | `migration-competitions-bulk.sql` | Inserts 50 real, verified competitions (pre-approved) into `public.competitions`. Fixed UUIDs + `on conflict (id) do nothing` → safe to re-run. |

## Notes on `migration-hardening.sql`

**Run this BEFORE anything else pending.** Until it is applied, any signed-in
student can call `update({ role: 'admin' })` on their own `public.users` row and
take over the admin panel.

It builds on the already-applied files and must come after them: it reads
`users.is_portfolio_public` (`migration-portfolio.sql`) and `site_settings`
(`migration-admin.sql`), so on a database missing either it fails at that
statement and the SQL editor rolls the whole script back.

- `public.is_privileged_writer()` — shared predicate for the guard triggers: admin, service-role key, or a direct psql/SQL-editor session.
- **users** — `before update` trigger rejects changes to `role`, `id` or `email` from anyone but an admin. The admin panel's role dropdown keeps working (it runs as an admin through the browser client).
- **competitions / clubs** — inserting a competition now requires `is_club_leader()`, non-admin inserts must start unapproved (and a new club at `member_count = 0`), and `before update` triggers reject changes to `is_approved` / `is_featured` / `member_count`. The automatic `sync_club_member_count()` trigger is exempted via `pg_trigger_depth()`.
- **custom_activities** — the public-portfolio read policy now calls the new security-definer `public.has_public_portfolio(uuid)`; the old inline subquery ran as the caller and always returned nothing, so shared portfolios and `/profiles` counts read as empty.
- **participation** — club leaders can read their own club's rows, plus a new `public.club_members(uuid)` RPC returning `user_id, full_name, school, grade, status, joined_at` for the Members roster.
- **participation** — duplicate `(user_id, club_id)` rows are deleted (earliest kept) before a partial unique index is created.
- **analytics_events** — inserts must match `auth.uid()` (or be anonymous with a null `user_id`) instead of `with check (true)`.
- **community_submissions** — inserts now honour the admin `allow_submissions` switch server-side and must start as `pending`.
- Adds indexes on `participation.club_id`, `participation.competition_id`, `custom_activities.user_id`, and a commented-out (unscheduled) analytics retention statement.
- It replaces policies that `schema.sql` and `migration-portfolio.sql` also create, so re-running either of those afterwards reopens the gaps — always finish with this file.

## Notes on `migration-competitions-bulk.sql`
- 50 competitions across all categories (Science, STEM, Math, Tech, Debate, Business, Arts, Sports, Other), mix of Singapore-only, Both, and Global.
- Every `registration_link` is a real official URL verified via web search.
- Deadlines/event dates are **relative** (`current_date + interval 'N days'`) so listings always read as upcoming. Replace with real annual deadlines when known.
- Rows already present in `seed.sql` (SSEF, SMO, Conrad Challenge, F1 in Schools, UOB Painting of the Year, National Schools Debating) were intentionally **excluded** to avoid duplicates.
- `club_id` is `null` (not tied to a F.I.R.E club). `is_featured` is set on ~9 marquee competitions.
