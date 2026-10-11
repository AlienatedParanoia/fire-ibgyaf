import Link from "next/link";
import { Megaphone, ArrowRight } from "lucide-react";
import type { Announcement } from "@/lib/types";

/** Slim banner for the landing page: the most important approved announcement(s). */
export function AnnouncementsStrip({ items }: { items: Pick<Announcement, "id" | "title">[] }) {
  if (items.length === 0) return null;
  return (
    <Link
      href="/announcements"
      className="flex items-center justify-center gap-3 bg-ink px-4 py-2.5 text-center text-[14px] text-paper transition-colors hover:bg-ink/90"
    >
      <Megaphone className="h-4 w-4 shrink-0 text-coral" />
      <span className="truncate">{items[0].title}</span>
      {items.length > 1 && <span className="hidden shrink-0 text-paper/60 sm:inline">+{items.length - 1} more</span>}
      <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-coral">
        See all <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
