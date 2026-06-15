"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import type { CalendarEventType } from "@/lib/types";

export interface CalEvent {
  id: string;
  date: string;
  title: string;
  type: CalendarEventType;
}

const TYPE_COLOR: Record<CalendarEventType, string> = {
  competition: "bg-fire text-white",
  club: "bg-electric text-white",
  custom: "bg-charcoal/50 text-white",
};
const TYPE_DOT: Record<CalendarEventType, string> = {
  competition: "bg-fire",
  club: "bg-electric",
  custom: "bg-charcoal/50",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function CalendarView({ events }: { events: CalEvent[] }) {
  const today = new Date();
  const [cursor, setCursor] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = React.useState<string | null>(null);

  const byDate = React.useMemo(() => {
    const map = new Map<string, CalEvent[]>();
    for (const e of events) {
      const key = e.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const selectedEvents = selected ? byDate.get(selected) ?? [] : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-charcoal/10 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-charcoal">
            {cursor.toLocaleDateString("en-SG", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month - 1, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
            >
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month + 1, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="pb-2 text-center text-xs font-semibold text-muted-foreground">
              {w}
            </div>
          ))}
          {cells.map((date, i) => {
            if (!date) return <div key={`e-${i}`} />;
            const key = ymd(date);
            const dayEvents = byDate.get(key) ?? [];
            const isToday = key === ymd(today);
            const isSelected = key === selected;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={cn(
                  "flex min-h-[72px] flex-col rounded-lg border p-1.5 text-left transition-colors",
                  isSelected ? "border-fire ring-1 ring-fire/30" : "border-charcoal/5 hover:bg-muted/50"
                )}
              >
                <span
                  className={cn(
                    "mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                    isToday ? "bg-fire text-white" : "text-charcoal/70"
                  )}
                >
                  {date.getDate()}
                </span>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map((e) => (
                    <span
                      key={e.id}
                      className={cn(
                        "block truncate rounded px-1 py-0.5 text-[10px] font-medium",
                        TYPE_COLOR[e.type]
                      )}
                    >
                      {e.title}
                    </span>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="block text-[10px] text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* legend */}
        <div className="mt-4 flex flex-wrap gap-4 border-t border-charcoal/5 pt-4 text-xs">
          {(["competition", "club", "custom"] as CalendarEventType[]).map((t) => (
            <span key={t} className="flex items-center gap-1.5 capitalize text-muted-foreground">
              <span className={cn("h-2.5 w-2.5 rounded-full", TYPE_DOT[t])} /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* side panel */}
      <div className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold text-charcoal">
          <CalendarDays className="h-5 w-5 text-fire" />
          {selected ? formatDate(selected) : "Select a date"}
        </h3>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected ?? "none"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {!selected ? (
              <p className="text-sm text-muted-foreground">
                Click any day to see the competitions, club events, and activities scheduled.
              </p>
            ) : selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing scheduled on this day.</p>
            ) : (
              <ul className="space-y-2">
                {selectedEvents.map((e) => (
                  <li key={e.id} className="flex items-start gap-2 rounded-lg border border-charcoal/5 p-3">
                    <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", TYPE_DOT[e.type])} />
                    <div>
                      <p className="text-sm font-medium text-charcoal">{e.title}</p>
                      <p className="text-xs capitalize text-muted-foreground">{e.type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
