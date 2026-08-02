"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Postgres `date` columns arrive as a bare "YYYY-MM-DD", which `new Date()`
 * reads as midnight UTC — the timer would hit zero mid-morning here. A day
 * without a time means the student has until the end of that day, locally.
 */
function deadlineTime(deadline: string): number {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(deadline.trim());
  if (!parts) return new Date(deadline).getTime();
  return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]), 23, 59, 59, 999).getTime();
}

/** Reusable deadline countdown timer (days / hours / minutes / seconds). */
export function Countdown({ deadline, className }: { deadline: string | null; className?: string }) {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!deadline) return <span className={cn("text-sm text-muted-foreground", className)}>No deadline</span>;

  const target = deadlineTime(deadline);
  const diff = target - now;

  if (Number.isNaN(target)) return null;
  if (diff <= 0)
    return <span className={cn("text-sm font-medium text-muted-foreground", className)}>Registration closed</span>;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const units = [
    { label: "Days", value: days },
    { label: "Hrs", value: hours },
    { label: "Min", value: mins },
    { label: "Sec", value: secs },
  ];

  return (
    <div className={cn("flex gap-2", className)}>
      {units.map((u, i) => {
        const isSeconds = i === units.length - 1;
        return (
          <div
            key={u.label}
            className={cn(
              "flex min-w-[3.25rem] flex-col items-center rounded-lg px-2 py-1.5 text-white",
              isSeconds ? "bg-coral" : "bg-ink"
            )}
          >
            <span className="font-heading text-lg font-bold tabular-nums leading-none">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="mt-0.5 text-[10px] uppercase tracking-wide text-white/60">{u.label}</span>
          </div>
        );
      })}
    </div>
  );
}
