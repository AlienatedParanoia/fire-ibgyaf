# F.I.R.E. Component Conventions

## Design tokens

| Token | Value | Used for |
|---|---|---|
| `ember` / `fire` | `#FF4D00` | Primary CTAs, active states, fire brand |
| `electric` / `pen` | `#0066FF` | Club events, secondary accents |
| `ink` | `#211E18` | Body text |
| `ink-soft` | `#6B6B80` | Muted/secondary text |
| `ink-faint` | `#A8A29E` | Placeholder text |
| `paper` | `#FAF8F5` | Page background |
| `panel` | `#F5F3EF` | Input backgrounds, muted panels |
| `charcoal` | `#211E18` | Same as `ink`; used in countdown tiles and hard shadows |

## Typography

- **Headings**: `font-heading` → Newsreader (serif), imported via Next.js `next/font/google`
- **Body**: `font-sans` → Hanken Grotesk (sans-serif)
- **Handwriting accents**: `font-hand` → Caveat (cursive), used for footer section titles, the Logo "(beta)" tag, and section labels

> Fonts are served at runtime from Google Fonts. In preview cards they fall back to system fonts — correct once loaded in a design.

## Button variants

| variant | appearance | use |
|---|---|---|
| `ember` | Ember orange bg + hard ink shadow | Primary CTAs |
| `sketch` | White bg + ink border + hard shadow | Secondary on light surfaces |
| `outline` | Panel bg + ink/15 border | Low-emphasis actions |
| `ghost` | Transparent, hover bg | Tertiary / nav actions |
| `subtle` | Ember/10 bg + ember text | Saved/completed states |
| `destructive` | Red bg | Delete / danger actions |

## Card system

`Card` is composed from `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. All sub-components are individually importable. Use `CardSkeleton` as the loading state.

## Badge conventions

- `CategoryBadge`: uses `categoryColor(category)` for automatic per-category tinting — always pass `category` as a string, not a Tailwind class.
- `FormatBadge`: `format: "online" | "onsite" | "hybrid"` — includes icon automatically.
- `RegionBadge`: `region: "Singapore" | "Global" | "Both"` — always includes Globe icon.
- `Badge` (raw): pass `className` with your own Tailwind tint (`bg-purple-100 text-purple-700`).

## Participation status colors

| status | badge class |
|---|---|
| `interested` | `bg-charcoal/10 text-charcoal/70` |
| `registered` | `bg-electric-50 text-electric-700` |
| `participated` | `bg-amber-100 text-amber-700` |
| `won` | `bg-emerald-100 text-emerald-700` |

## Chart palette

`PIE_COLORS = ["#FF4D00", "#0066FF", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6", "#64748B"]` — used by `PieChartCard` and `ChartLegend` automatically.

- `LineChartCard`: ember line (`#FF4D00`)
- `BarChartCard`: electric blue by default (`#0066FF`); pass `color` prop to override

## Animation wrappers (excluded from bundle)

`RevealSection`, `PageTransition`, and `Dialog` are NOT in the bundle (`componentSrcMap: null`):

- **RevealSection**: Framer Motion `whileInView` wrapper — wraps sections in page content
- **PageTransition**: Framer Motion enter animation keyed on `usePathname()` — wraps page content in layout
- **Dialog**: `createPortal` modal — use via `open={boolean}` + `onClose` + `title` props

## Supabase-dependent components

`JoinClubButton`, `TrackerView`, `PortfolioView`, `ClubLeaderDashboard`, `AdminPanel` and all admin sub-sections call `getSupabaseBrowser()` for mutations. This returns `null` when env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are not set, and all handlers toast an error message rather than throwing. Initial render state is always driven by props, not Supabase.

## Groups

| group | components |
|---|---|
| `general` | Badge, BarChartCard, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardSkeleton, CardTitle, CategoryBadge, ChartLegend, Countdown, EmptyState, Footer, FormatBadge, Input, Label, LineChartCard, Logo, PieChartCard, RegionBadge, SectionHeading, Select, Skeleton, StatCounter, Textarea |
| `admin` | AdminPanel, ApprovalsSection, ClubsManage, CompetitionsManage, SettingsSection, SubmissionsSection, UsersSection |
| `calendar` | CalendarView |
| `club-leader` | ClubLeaderDashboard |
| `clubs` | ClubsGrid, JoinClubButton |
| `competitions` | CompetitionsBrowser |
| `portfolio` | ActivityCard, PortfolioView |
| `tracker` | TrackerView |
