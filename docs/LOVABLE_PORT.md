# Features ported from the Lovable app

The student app at `app.find-involve-reach-engage.com` (Lovable + Supabase, repo `Sidsolegend/f-i-r-e`)
had features this app lacked. They now live here, adapted to this app's schema and Next.js stack.

| Feature | Where | Needs |
| --- | --- | --- |
| 16 GIIS clubs + richer club profiles | `/clubs`, `/clubs/[id]`, admin → Manage Clubs | `migration-lovable-clubs.sql` |
| Club contact email/phone hidden from signed-out users | column-level grant on `clubs` | `migration-lovable-clubs.sql`, `supabase/private/club-contacts.local.sql` (gitignored) |
| Announcements (admin + club-leader submissions) | `/announcements`, landing banner, admin tab, leader dashboard tab | `migration-announcements-favorites.sql` |
| Club favorites | heart on clubs, "Saved" filter | `migration-announcements-favorites.sql` |
| Global search | ⌘/Ctrl+K in the navbar | — |
| Admin audit log | admin → Audit Log | `migration-roles-audit.sql` |
| Club-leader role requests | dashboard card → admin → Role Requests | `migration-roles-audit.sql` |
| Club team roles | leader dashboard, admin → Manage Clubs → team icon, public club pages | `migration-roles-audit.sql` |
| Google sign-in | login / signup | Google provider enabled in Supabase (below) |
| Self-service account deletion | dashboard → Delete account | `SUPABASE_SERVICE_ROLE_KEY` |
| Interaction tracking, item popularity, For You | `/for-you`, `/api/cron/popularity` | `migration-ai-tracking.sql`, `CRON_SECRET` |
| AI chatbot (Gemini) | floating widget, `/api/chat` | `GEMINI_API_KEY` |

Event approvals and club approvals already existed here (admin → Competition Approvals / Club Approvals).

## Setup checklist

1. Run the pending SQL files in order — see `supabase/PENDING_MIGRATIONS.md`.
2. Vercel env vars: `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`).
3. Google sign-in: Supabase → Authentication → Providers → Google (client ID/secret from Google Cloud
   Console; its authorised redirect URI is `https://<project-ref>.supabase.co/auth/v1/callback`), and
   add `https://projectfire.dev/auth/confirm` (plus any preview/localhost URLs) under Authentication →
   URL Configuration → Redirect URLs.
4. Compare the two sites' clubs any time with `node scripts/check-club-sync.mjs`.

## Notes

- "AI recommendations" in the Lovable app were SQL scoring, not an LLM call; they are ported the same
  way (`get_recommendations()`), with a short "why" shown on each card.
- The chat assistant only sees public, approved data and requires a signed-in user. Its rate limit is
  best-effort per serverless instance; Gemini's own quota is the hard cap.

## Demo data for marketing videos

`node scripts/seed-demo.mjs --yes` fills the site with invented GIIS students who have joined clubs
and a demo leader for each club without one; `node scripts/remove-demo.mjs --yes` deletes it all.
Demo accounts all use `@demo.projectfire.invalid` emails (never deliverable, never a real person),
are created pre-confirmed so no email is sent, and only create club memberships — no views, saves or
other interactions, so the For You picks and popularity scores stay driven by real students.
Needs `SUPABASE_SERVICE_ROLE_KEY` and `DEMO_PASSWORD` in `.env.local`.

## Inviting real club leaders

Admin → Manage Clubs → the envelope icon on a club without a leader emails an invitation (prefilled
with the club's contact address). The recipient sets their own password and becomes that club's
leader when they accept. Requires `https://projectfire.dev/auth/confirm` in Supabase's allowed
redirect URLs.
