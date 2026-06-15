import { requireUser } from "@/lib/auth";
import { CalendarView, type CalEvent } from "@/components/calendar/calendar-view";
import type { Participation, CustomActivity, CalendarEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const { authUser, supabase } = await requireUser();
  const uid = authUser!.id;

  const [partRes, actRes, calRes] = await Promise.all([
    supabase.from("participation").select("*, competitions(*)").eq("user_id", uid),
    supabase.from("custom_activities").select("*").eq("user_id", uid),
    supabase.from("calendar_events").select("*").eq("user_id", uid),
  ]);

  const events: CalEvent[] = [];

  for (const p of (partRes.data ?? []) as Participation[]) {
    if (p.competitions?.deadline) {
      events.push({
        id: `comp-${p.id}`,
        date: p.competitions.deadline,
        title: p.competitions.title,
        type: "competition",
      });
    }
  }
  for (const a of (actRes.data ?? []) as CustomActivity[]) {
    if (a.date) events.push({ id: `act-${a.id}`, date: a.date, title: a.title, type: "custom" });
  }
  for (const c of (calRes.data ?? []) as CalendarEvent[]) {
    events.push({ id: `cal-${c.id}`, date: c.date, title: c.title, type: c.event_type });
  }

  return (
    <div className="container py-10">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">Calendar</h1>
        <p className="mt-2 text-muted-foreground">
          All your deadlines and activities in one view. Orange = competition, blue = club, grey =
          custom.
        </p>
      </header>
      <CalendarView events={events} />
    </div>
  );
}
