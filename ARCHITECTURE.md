# Architecture

How the F.I.R.E codebase is organised and how a request flows through it. Read this
top-to-bottom to understand "what calls what."

## Tech stack

- **Next.js (App Router)** — server components fetch data; client components handle interactivity.
- **Supabase** — Postgres + Auth + Storage + Row-Level Security (RLS).
- **Tailwind CSS** + a small set of shadcn-style UI primitives.
- **Framer Motion** (animation), **Recharts** (admin analytics), **Sonner** (toasts).
- **Vercel** — hosting + a daily cron for deadline reminders.

## Directory map

```
src/
├─ app/                       # routes (App Router). Each folder = a URL segment.
│  ├─ layout.tsx              # root shell: fonts, Navbar, Footer, Toaster, PageTransition
│  ├─ globals.css             # brand tokens + utilities + print styles
│  ├─ page.tsx                # public landing page
│  ├─ login/ · signup/        # auth screens
│  ├─ competitions/           # page.tsx (server fetch) + loading.tsx skeleton
│  ├─ clubs/                  # list page + clubs/[id] detail
│  ├─ dashboard/ tracker/     # signed-in student views
│  ├─ calendar/ portfolio/    # calendar + portfolio (+ portfolio/[id] public view)
│  ├─ profiles/ submit/       # public profiles + community submission form
│  ├─ club-leader/            # club-leader dashboard
│  ├─ admin/                  # admin panel (admin-only)
│  └─ api/cron/reminders/     # route.ts — daily reminders job (server-only)
├─ components/
│  ├─ ui/                     # primitives: button, card, input, dialog, badge,
│  │                          #   empty-state, skeleton, image-upload
│  ├─ competitions/           # competitions-browser, competition-form-dialog,
│  │                          #   teammates-panel, badges
│  ├─ clubs/                  # clubs-grid, club-form-dialog, join-club-button
│  ├─ tracker/ calendar/      # feature views
│  ├─ portfolio/              # portfolio-view, activity-card, resume-document
│  ├─ club-leader/            # leader dashboard
│  ├─ admin/                  # admin-panel + one file per section (see below)
│  └─ navbar, footer, logo, page-transition, countdown,
│     interests-dialog, interests-prompt, notifications-bell
├─ lib/
│  ├─ supabase/               # client.ts (browser) · server.ts (SSR) · admin.ts (service-role)
│  ├─ auth.ts                 # requireUser() route guard
│  ├─ types.ts                # shared TypeScript types for every entity
│  └─ utils.ts                # cn(), date/deadline helpers, CSV, CATEGORIES, colours
└─ middleware.ts              # refreshes the Supabase session on every request

supabase/   schema.sql + seed.sql + migration-*.sql   (see docs/migrations.md)
scripts/    seed.mjs           (creates demo accounts + seeds sample data)
public/     static assets (logos)
docs/       SETUP.md, migrations.md
```

## Rendering & data flow

The common pattern: a **server component page** fetches data from Supabase, then hands it
to a **client component** that handles UI state and mutations.

```
app/<feature>/page.tsx   ──fetch──▶  Supabase (RLS-scoped)
        │ passes data as props
        ▼
components/<feature>/<feature>-view.tsx  ("use client")
        │ opens
        ▼
dialogs / panels  ──mutate──▶  Supabase (getSupabaseBrowser)
```

Example — competitions:
`app/competitions/page.tsx` (fetches competitions, the viewer's saved items, interest counts)
→ `components/competitions/competitions-browser.tsx` (search/filter/"For You" ranking)
→ `competition-form-dialog.tsx` (admin edit), `teammates-panel.tsx`, `interests-dialog.tsx`.

## Auth & access control

1. `middleware.ts` refreshes the Supabase auth session on each request.
2. Server code reads the user via `getCurrentUser()` (`lib/supabase/server.ts`); protected
   pages call `requireUser([roles])` (`lib/auth.ts`), which redirects when unauthorised.
3. **Three roles** — `student`, `club_leader`, `admin` — gate UI and are enforced in the
   database by **Row-Level Security** policies (see `supabase/*.sql`).
4. **Three Supabase clients:**
   - `getSupabaseBrowser()` — client components (anon key, RLS-scoped to the user).
   - `getSupabaseServer()` — server components (SSR cookies).
   - `getSupabaseAdmin()` — **server-only** service-role client, used solely by the
     reminders cron for trusted batch work. Never imported into client code.

## Admin panel

`components/admin/admin-panel.tsx` is a tabbed shell; each tab is its own file:
`users-section` (+ `user-edit-dialog`), `competitions-manage`, `clubs-manage`
(+ `club-members-panel`), `participation-section`, `notifications-section`,
`approvals-section`, `submissions-section`, `settings-section`, plus `charts` + `compute`
for analytics. Admin writes use the browser client; admin-scoped RLS policies authorise them.

## Background job — deadline reminders

`vercel.json` schedules a daily call to `app/api/cron/reminders/route.ts`. The route
(authenticated by a shared secret) uses the **service-role** client to find saved
competitions whose deadline is 7/3/1 days out, writes an in-app `notifications` row, and
sends an email via Resend when configured. A `reminders_sent` table prevents duplicates.
Recipients see notifications via `components/notifications-bell.tsx`.

## Database & migrations

Run order (details + checklist in [`docs/migrations.md`](./docs/migrations.md)):

1. `supabase/schema.sql` — core tables, enums, RLS, triggers.
2. `supabase/migration-portfolio.sql` — portfolio activities + the `proofs` storage bucket.
3. `supabase/migration-features.sql` — interests, social proof, teammates, notifications, reminders.
4. `supabase/migration-admin.sql` — admin media bucket, member-count sync, admin policies, settings.
