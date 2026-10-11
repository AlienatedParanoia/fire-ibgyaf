import { cn } from "@/lib/utils";
import type { AnnouncementPriority } from "@/lib/types";

const STYLE: Record<AnnouncementPriority, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-ink/8 text-ink-soft",
};

export function PriorityBadge({ priority }: { priority: AnnouncementPriority }) {
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", STYLE[priority])}>
      {priority}
    </span>
  );
}
