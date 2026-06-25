"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Users,
  Trophy,
  Building2,
  Inbox,
  BarChart3,
  Settings,
  Activity,
  Clock,
  UserCheck,
  Radio,
  PenSquare,
  ClipboardList,
} from "lucide-react";
import type { AdminData } from "@/app/admin/page";
import { cn, formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { LineChartCard, BarChartCard, PieChartCard, ChartLegend } from "./charts";
import {
  signupsOverTime,
  competitionsByCategory,
  usersByGrade,
  eventsPerWeek,
  weeklyActiveUsers,
  topSavedCompetitions,
  topClubs,
  participationBreakdown,
  weeklyLogins,
} from "./compute";
import { UsersSection, SectionHeading } from "./users-section";
import { ApprovalsSection } from "./approvals-section";
import { SubmissionsSection } from "./submissions-section";
import { SettingsSection } from "./settings-section";
import { CompetitionsManage } from "./competitions-manage";
import { ClubsManage } from "./clubs-manage";

type Section =
  | "overview"
  | "users"
  | "competitions"
  | "clubs"
  | "comp-approvals"
  | "club-approvals"
  | "submissions"
  | "analytics"
  | "settings";

export function AdminPanel({ data }: { data: AdminData }) {
  const [section, setSection] = React.useState<Section>("overview");

  const pendingComps = data.competitions.filter((c) => !c.is_approved).length;
  const pendingClubs = data.clubs.filter((c) => !c.is_approved).length;
  const pendingSubs = data.submissions.filter((s) => s.status === "pending").length;

  const nav: { key: Section; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: "overview",       label: "Overview",               icon: LayoutGrid },
    { key: "users",          label: "Users",                  icon: Users },
    { key: "competitions",   label: "Manage Competitions",    icon: Trophy,      badge: data.competitions.length },
    { key: "clubs",          label: "Manage Clubs",           icon: Building2,   badge: data.clubs.length },
    { key: "comp-approvals", label: "Competition Approvals",  icon: ClipboardList, badge: pendingComps },
    { key: "club-approvals", label: "Club Approvals",         icon: PenSquare,   badge: pendingClubs },
    { key: "submissions",    label: "Submissions",            icon: Inbox,       badge: pendingSubs },
    { key: "analytics",      label: "Analytics",              icon: BarChart3 },
    { key: "settings",       label: "Settings",               icon: Settings },
  ];

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-medium text-ink">Admin Panel</h1>
        <p className="text-sm text-ink-soft">Manage the F.I.R.E platform.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="flex gap-1 overflow-x-auto rounded-xl border border-ink/10 bg-panel p-1.5 shadow-sm lg:flex-col lg:overflow-visible">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => setSection(n.key)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:w-full",
                  section === n.key
                    ? "bg-ember text-white shadow-sm"
                    : "text-ink-soft hover:bg-paper hover:text-ink"
                )}
              >
                <n.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{n.label}</span>
                {!!n.badge && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-xs font-semibold",
                      section === n.key ? "bg-white/25 text-white" : "bg-ember/10 text-ember"
                    )}
                  >
                    {n.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* content */}
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {section === "overview"       && <Overview data={data} />}
          {section === "users"          && <UsersSection users={data.users} />}
          {section === "competitions"   && <CompetitionsManage initial={data.competitions} clubs={data.clubs} />}
          {section === "clubs"          && <ClubsManage initial={data.clubs} users={data.users} />}
          {section === "comp-approvals" && (
            <ApprovalsSection kind="competition" competitions={data.competitions} />
          )}
          {section === "club-approvals" && <ApprovalsSection kind="club" clubs={data.clubs} />}
          {section === "submissions"    && <SubmissionsSection submissions={data.submissions} />}
          {section === "analytics"      && <Analytics data={data} />}
          {section === "settings"       && <SettingsSection />}
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────── OVERVIEW ─────────────────────────── */
function Overview({ data }: { data: AdminData }) {
  const kpis = [
    { label: "Total Users",         value: data.users.length,                          icon: Users,      color: "text-ember bg-ember/10" },
    { label: "Total Clubs",         value: data.clubs.length,                          icon: Building2,  color: "text-pen bg-pen/10" },
    { label: "Total Competitions",  value: data.competitions.length,                   icon: Trophy,     color: "text-emerald-600 bg-emerald-50" },
    {
      label: "Pending Approvals",
      value:
        data.competitions.filter((c) => !c.is_approved).length +
        data.clubs.filter((c) => !c.is_approved).length,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    { label: "Weekly Logins",       value: weeklyLogins(data),                         icon: UserCheck,  color: "text-purple-600 bg-purple-50" },
    {
      label: "Submissions Pending",
      value: data.submissions.filter((s) => s.status === "pending").length,
      icon: Inbox,
      color: "text-rose-600 bg-rose-50",
    },
  ];

  const signups = signupsOverTime(data);
  const byCat   = competitionsByCategory(data);
  const byGrade = usersByGrade(data);

  return (
    <div>
      <SectionHeading title="Overview" subtitle="Platform health at a glance" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-ink/10 bg-panel p-5 shadow-sm">
            <div className={cn("mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl", k.color)}>
              <k.icon className="h-5 w-5" />
            </div>
            <p className="font-heading text-3xl font-bold text-ink">{k.value}</p>
            <p className="text-sm text-ink-soft">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="User signups (last 30 days)">
          <LineChartCard data={signups} />
        </ChartCard>
        <ChartCard title="Competitions by category">
          <BarChartCard data={byCat} />
        </ChartCard>
        <ChartCard title="Users by grade">
          <PieChartCard data={byGrade} />
          <ChartLegend data={byGrade} />
        </ChartCard>
        <RealtimeFeed initial={data.analytics} users={data.users} />
      </div>
    </div>
  );
}

/* ─────────────────────────── ANALYTICS ─────────────────────────── */
function Analytics({ data }: { data: AdminData }) {
  const wau      = weeklyActiveUsers(data);
  const topSaved = topSavedCompetitions(data);
  const clubs    = topClubs(data);
  const breakdown = participationBreakdown(data);
  const epw      = eventsPerWeek(data);

  return (
    <div>
      <SectionHeading title="Analytics" subtitle="Engagement & participation insights" />
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Weekly active users (last 8 weeks)">
          <BarChartCard data={wau} color="#CC5230" />
        </ChartCard>
        <ChartCard title="Events logged per week">
          <LineChartCard data={epw} />
        </ChartCard>
        <ChartCard title="Participation status breakdown">
          {breakdown.length ? (
            <>
              <PieChartCard data={breakdown} />
              <ChartLegend data={breakdown} />
            </>
          ) : (
            <Empty />
          )}
        </ChartCard>
        <ChartCard title="Top 5 most-saved competitions">
          <RankList data={topSaved} unit="saves" />
        </ChartCard>
        <ChartCard title="Top 5 clubs by members">
          <RankList data={clubs} unit="members" />
        </ChartCard>
      </div>
    </div>
  );
}

function RankList({ data, unit }: { data: { label: string; value: number }[]; unit: string }) {
  if (!data.length) return <Empty />;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-3">
      {data.map((d, i) => (
        <li key={d.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/10 text-xs font-bold text-ember">
                {i + 1}
              </span>
              <span className="truncate text-ink">{d.label}</span>
            </span>
            <span className="shrink-0 text-xs font-medium text-ink-faint">
              {d.value} {unit}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-paper">
            <div
              className="h-full rounded-full bg-ember"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ─────────────────────── REALTIME ACTIVITY FEED ─────────────────────── */
function RealtimeFeed({
  initial,
  users,
}: {
  initial: AdminData["analytics"];
  users: AdminData["users"];
}) {
  const [events, setEvents] = React.useState(initial.slice(0, 12));
  const [live, setLive] = React.useState(false);
  const nameFor = React.useCallback(
    (id: string | null) => users.find((u) => u.id === id)?.full_name ?? "Someone",
    [users]
  );

  React.useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const channel = supabase
      .channel("admin-activity")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "analytics_events" },
        (payload) => {
          const e = payload.new as AdminData["analytics"][number];
          setEvents((list) => [e, ...list].slice(0, 12));
        }
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function describe(t: string) {
    if (t === "competition_saved") return "saved a competition";
    if (t === "club_joined") return "joined a club";
    return t.replace(/_/g, " ");
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-panel p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-ink">
          <Activity className="h-4 w-4 text-ember" /> Live activity
        </h3>
        <span
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            live ? "text-emerald-600" : "text-ink-faint"
          )}
        >
          <Radio className="h-3 w-3" /> {live ? "Live" : "Offline"}
        </span>
      </div>
      {events.length === 0 ? (
        <Empty />
      ) : (
        <ul className="max-h-[220px] space-y-3 overflow-y-auto scrollbar-thin">
          {events.map((e, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ember" />
              <div>
                <p className="text-sm text-ink">
                  <span className="font-medium">{nameFor(e.user_id)}</span> {describe(e.event_type)}
                </p>
                <p className="text-xs text-ink-faint">{formatDate(e.created_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-panel p-5 shadow-sm">
      <h3 className="mb-4 font-heading text-base font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function Empty() {
  return (
    <div className="flex h-[200px] flex-col items-center justify-center text-center text-sm text-ink-faint">
      <Inbox className="mb-2 h-8 w-8 opacity-40" />
      No data yet
    </div>
  );
}
