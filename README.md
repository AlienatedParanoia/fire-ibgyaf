# F.I.R.E — Find. Involve. Reach. Engage.

> Your gateway to every opportunity.

A student-led platform connecting Singapore students (ages 13–18) to extracurricular
competitions, clubs, and challenges — all in one bright, fast, organised hub.

Built with **Next.js 14 (App Router)**, **Supabase** (auth + Postgres + realtime),
**Tailwind CSS**, shadcn-style UI, **Framer Motion**, and **Recharts**.

---

## Features

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

## Project structure

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

Built by students, for students. 
