# Local development setup

## Prerequisites
- Node.js 18+
- A Supabase project (free tier is fine)

## 1. Install dependencies
```bash
npm install
```

## 2. Configure environment
Copy the example file and fill in values from your Supabase dashboard
(Project Settings → API). See [`.env.example`](../.env.example) for the full list and notes.

```bash
cp .env.example .env.local
```

Required to run the app:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Required for the seed script and the reminders cron (server-only — never expose these):
- `SUPABASE_SERVICE_ROLE_KEY`
- `SEED_DEMO_PASSWORD` (seed script only)
- `CRON_SECRET`, and optionally `RESEND_API_KEY` / `REMINDER_FROM_EMAIL` (reminder emails)

## 3. Set up the database
In the Supabase SQL editor, run the SQL files **in order** — see
[`migrations.md`](./migrations.md) for the checklist:

1. `supabase/schema.sql`
2. `supabase/migration-portfolio.sql`
3. `supabase/migration-features.sql`
4. `supabase/migration-admin.sql`

## 4. Seed demo data (optional)
Creates demo accounts and sample clubs/competitions using the service-role key:
```bash
node scripts/seed.mjs
```

## 5. Run the dev server
```bash
npm run dev
```
The app runs at http://localhost:3000.

## Useful checks
```bash
npx tsc --noEmit     # type-check
npx next build       # production build
```
