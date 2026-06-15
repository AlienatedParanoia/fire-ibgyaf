# 🔥 F.I.R.E — Find. Involve. Reach. Engage.

> Your gateway to every opportunity.

A student-led platform connecting Singapore students (ages 13–18) to extracurricular
competitions, clubs, and challenges — all in one bright, fast, organised hub.

Built with **Next.js 14 (App Router)**, **Supabase** (auth + Postgres + realtime),
**Tailwind CSS**, shadcn-style UI, **Framer Motion**, and **Recharts**.

---

## ✨ Features

- **Public landing page** — animated gradient hero, live stat counters, feature highlights, testimonials.
- **Auth** — email/password sign up & login via Supabase Auth (collects name, school, grade).
- **Competitions directory** — searchable & filterable (category, region, format, deadline), featured pinning, deadline-urgency colours, save-to-tracker, detail modal with a live countdown.
- **Clubs** — category-filtered grid + rich club detail pages with join CTA and the club's competitions.
- **Student dashboard** — summary cards, quick actions, upcoming deadlines, recent activity feed.
- **My Tracker** — status pipeline (Interested → Registered → Participated → Won), per-item notes, custom activity logging, **CSV export**.
- **Calendar** — colour-coded monthly view (orange = competition, blue = club, grey = custom).
- **Community Submit** — anyone (no login) can suggest a competition/club; it lands in the admin review queue.
- **Club Leader dashboard** — manage club profile, list/edit competitions, view members.
- **Admin panel** — KPI overview, Recharts analytics, user-role management, competition/club approvals, community-submission review (one-click → live record), realtime activity feed, settings.
- **Three roles** — `student`, `club_leader`, `admin` — enforced with Supabase **Row Level Security**.
- Toasts, loading skeletons, empty states, 404 + error pages, smooth page transitions, fully mobile-responsive.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) → **New project**. Then grab your keys from
**Project Settings → API**.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → `service_role` key (server only — keep secret) |

### 4. Create the database schema

In the Supabase **SQL Editor**, run the contents of:

1. `supabase/schema.sql` — tables, enums, triggers, RLS policies, realtime.
2. `supabase/seed.sql` — 5 sample clubs + 8 sample competitions (+ a couple of community submissions).

> The schema includes a trigger that auto-creates a `public.users` profile row whenever someone signs up.

### 5. (Optional) Seed demo accounts

Creates three ready-to-use logins (admin / club leader / student):

```bash
node scripts/seed.mjs
```

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@fire.sg` | `FirePass123!` |
| Club Leader | `leader@fire.sg` | `FirePass123!` |
| Student | `student@fire.sg` | `FirePass123!` |

> To make any existing account an admin manually:
> `update public.users set role = 'admin' where email = 'you@example.com';`

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Database schema

`users`, `clubs`, `competitions`, `participation`, `custom_activities`,
`calendar_events`, `analytics_events`, `community_submissions`.

See [`supabase/schema.sql`](./supabase/schema.sql) for full columns, enums, and the RLS policy set:

- Students read only **approved** competitions/clubs and write only their **own** participation, activities, and calendar rows.
- Club leaders edit only their **own** club and competitions.
- Admins have **full** access.
- `community_submissions` — anyone may insert; only admins may read/update.

---

## 🧱 Project structure

```
src/
├─ app/                  # App Router pages (landing, auth, competitions, clubs,
│  │                     #   dashboard, tracker, calendar, submit, club-leader, admin)
│  ├─ layout.tsx         # fonts, navbar, footer, toaster, page transitions
│  └─ globals.css        # brand tokens + animated gradient utilities
├─ components/
│  ├─ ui/                # shadcn-style primitives (button, card, input, dialog, …)
│  ├─ competitions/      # browser, cards, badges
│  ├─ clubs/             # grid, join button
│  ├─ tracker/           # tracker table + dialogs
│  ├─ calendar/          # monthly calendar
│  ├─ club-leader/       # leader dashboard
│  └─ admin/             # panel shell, sections, charts, analytics compute
├─ lib/
│  ├─ supabase/          # browser + server clients
│  ├─ types.ts           # shared TS types
│  ├─ auth.ts            # requireUser() route guard
│  └─ utils.ts           # cn, dates, deadline urgency, CSV, categories
└─ middleware.ts         # Supabase session refresh
supabase/                # schema.sql + seed.sql
scripts/seed.mjs         # demo-account seeder
```

---

## ☁️ Deploy

Deploys cleanly to **Vercel**. Add the three environment variables in the Vercel
project settings, then push. Run `schema.sql` + `seed.sql` against your production
Supabase project once.

---

## 🎯 Design notes

- **Palette:** deep orange `#FF4D00` (primary), electric blue `#0066FF` (accent), charcoal `#1A1A2E` (text), white surfaces.
- **Type:** Inter (body) + Sora (headings), via `next/font`.
- **Graceful degradation:** every Supabase call is null-safe, so the UI still renders (in demo mode) before you wire up your keys.

Built by students, for students. 🔥
