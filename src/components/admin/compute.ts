import type { AdminData } from "@/app/admin/page";

function dayKey(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** Signups per day for the last 30 days. */
export function signupsOverTime(data: AdminData) {
  const days: { label: string; value: number }[] = [];
  const counts = new Map<string, number>();
  for (const u of data.users) {
    const d = new Date(u.created_at);
    counts.set(d.toDateString(), (counts.get(d.toDateString()) ?? 0) + 1);
  }
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ label: dayKey(d), value: counts.get(d.toDateString()) ?? 0 });
  }
  return days;
}

export function competitionsByCategory(data: AdminData) {
  const counts = new Map<string, number>();
  for (const c of data.competitions) {
    const k = c.category || "Other";
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

export function usersByGrade(data: AdminData) {
  const counts = new Map<string, number>();
  for (const u of data.users) {
    const k = u.grade || "Unknown";
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

/** Events (any analytics event) grouped per ISO week for the last 8 weeks. */
export function eventsPerWeek(data: AdminData) {
  const weeks: { label: string; value: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const start = new Date();
    start.setDate(start.getDate() - i * 7 - start.getDay());
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const value = data.analytics.filter((e) => {
      const t = new Date(e.created_at).getTime();
      return t >= start.getTime() && t < end.getTime();
    }).length;
    weeks.push({ label: dayKey(start), value });
  }
  return weeks;
}

/** Weekly active users — distinct users with an analytics event per week (last 8). */
export function weeklyActiveUsers(data: AdminData) {
  const weeks: { label: string; value: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const start = new Date();
    start.setDate(start.getDate() - i * 7 - start.getDay());
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const set = new Set<string>();
    for (const e of data.analytics) {
      const t = new Date(e.created_at).getTime();
      if (t >= start.getTime() && t < end.getTime() && e.user_id) set.add(e.user_id);
    }
    weeks.push({ label: dayKey(start), value: set.size });
  }
  return weeks;
}

export function topSavedCompetitions(data: AdminData, n = 5) {
  const counts = new Map<string, number>();
  for (const p of data.participation) {
    if (p.competition_id) counts.set(p.competition_id, (counts.get(p.competition_id) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([id, value]) => ({
      label: data.competitions.find((c) => c.id === id)?.title ?? "Unknown",
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, n);
}

export function topClubs(data: AdminData, n = 5) {
  return [...data.clubs]
    .sort((a, b) => b.member_count - a.member_count)
    .slice(0, n)
    .map((c) => ({ label: c.name, value: c.member_count }));
}

export function participationBreakdown(data: AdminData) {
  const counts = new Map<string, number>();
  for (const p of data.participation) {
    counts.set(p.status, (counts.get(p.status) ?? 0) + 1);
  }
  const order = ["interested", "registered", "participated", "won"];
  return order
    .filter((s) => counts.has(s))
    .map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: counts.get(s) ?? 0 }));
}

/** Weekly logins proxy — distinct users active this week vs total. */
export function weeklyLogins(data: AdminData) {
  const weekAgo = Date.now() - 7 * 86400000;
  const set = new Set<string>();
  for (const e of data.analytics) {
    if (new Date(e.created_at).getTime() >= weekAgo && e.user_id) set.add(e.user_id);
  }
  return set.size;
}
