import Link from "next/link";
import {
  Bookmark,
  Users2,
  CalendarClock,
  ClipboardList,
  Search,
  PlusCircle,
  CalendarDays,
  ArrowRight,
  Flame,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { deadlineUrgency, formatDate, cn } from "@/lib/utils";
import type { Competition, Participation, CustomActivity } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { authUser, profile, supabase } = await requireUser();
  const uid = authUser!.id;

  const [partRes, actRes] = await Promise.all([
    supabase
      .from("participation")
      .select("*, competitions(*)")
      .eq("user_id", uid)
      .order("created_at", { ascending: false }),
    supabase
      .from("custom_activities")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false }),
  ]);

  const participation = (partRes.data ?? []) as Participation[];
  const activities = (actRes.data ?? []) as CustomActivity[];

  const savedComps = participation.filter((p) => p.competition_id);
  const joinedClubs = participation.filter((p) => p.club_id);

  const upcoming = savedComps
    .map((p) => p.competitions)
    .filter((c): c is Competition => !!c && !!c.deadline)
    .filter((c) => {
      const d = new Date(c.deadline!).getTime() - Date.now();
      return d >= 0 && d <= 30 * 86400000;
    })
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  const summary = [
    { label: "Competitions Saved", value: savedComps.length, icon: Bookmark, color: "text-fire bg-fire-50" },
    { label: "Clubs Joined", value: joinedClubs.length, icon: Users2, color: "text-electric bg-electric-50" },
    {
      label: "Upcoming Deadlines",
      value: upcoming.length,
      icon: CalendarClock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Activities Logged",
      value: activities.length + participation.length,
      icon: ClipboardList,
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  const quickActions = [
    { label: "Browse Competitions", href: "/competitions", icon: Search },
    { label: "Find Clubs", href: "/clubs", icon: Users2 },
    { label: "Add Activity", href: "/portfolio", icon: PlusCircle },
    { label: "View Calendar", href: "/calendar", icon: CalendarDays },
  ];

  // recent activity feed
  const feed = [
    ...participation.map((p) => ({
      id: p.id,
      when: p.created_at,
      text: p.competition_id
        ? `Saved “${p.competitions?.title ?? "a competition"}”`
        : "Joined a club",
    })),
    ...activities.map((a) => ({ id: a.id, when: a.created_at, text: `Logged activity “${a.title}”` })),
  ]
    .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
    .slice(0, 6);

  return (
    <div className="container py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-charcoal">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Student"} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            {profile?.school ? `${profile.school} · ` : ""}Here&apos;s your opportunity snapshot.
          </p>
        </div>
        <Link href="/competitions" className={buttonVariants({})}>
          <Flame className="h-4 w-4" /> Find opportunities
        </Link>
      </header>

      {/* summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="rounded-xl border border-charcoal/10 bg-white p-5 shadow-sm">
            <div className={cn("mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl", s.color)}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="font-heading text-3xl font-bold text-charcoal">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* quick actions */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group flex items-center gap-3 rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-fire/40 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-fire to-electric text-white">
              <a.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-charcoal">{a.label}</span>
            <ArrowRight className="ml-auto h-4 w-4 text-charcoal/30 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* upcoming deadlines */}
        <section className="rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-charcoal">
            <CalendarClock className="h-5 w-5 text-fire" /> Upcoming deadlines
          </h2>
          {upcoming.length === 0 ? (
            <EmptyState
              title="No upcoming deadlines"
              description="Save competitions to see their deadlines here."
              actionLabel="Browse competitions"
              actionHref="/competitions"
            />
          ) : (
            <ul className="space-y-2">
              {upcoming.map((c) => {
                const u = deadlineUrgency(c.deadline);
                return (
                  <li
                    key={c.id}
                    className="flex items-center justify-between rounded-lg border border-charcoal/5 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-charcoal">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(c.deadline)}</p>
                    </div>
                    <span className={cn("shrink-0 text-sm font-semibold", u.color)}>{u.label}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* recent activity */}
        <section className="rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-charcoal">
            <ClipboardList className="h-5 w-5 text-electric" /> Recent activity
          </h2>
          {feed.length === 0 ? (
            <EmptyState
              title="No activity yet"
              description="Your saves, joins, and logged activities will appear here."
              actionLabel="Get started"
              actionHref="/competitions"
            />
          ) : (
            <ul className="space-y-3">
              {feed.map((f) => (
                <li key={f.id} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-fire" />
                  <div>
                    <p className="text-sm text-charcoal">{f.text}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(f.when)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
