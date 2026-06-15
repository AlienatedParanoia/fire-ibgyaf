import * as React from "react";
import { ImageIcon, CalendarDays } from "lucide-react";
import { CategoryBadge } from "@/components/competitions/badges";
import { formatDate } from "@/lib/utils";
import type { CustomActivity } from "@/lib/types";

/** Presentational portfolio card (server-safe). `action` lets the owner view
 * slot in a delete button overlay. */
export function ActivityCard({
  activity,
  action,
}: {
  activity: CustomActivity;
  action?: React.ReactNode;
}) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-fire-100 to-electric-100">
        {activity.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activity.image_url}
            alt={activity.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-fire/40">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        {action && <div className="absolute right-2 top-2">{action}</div>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <CategoryBadge category={activity.category} />
          {activity.date && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" /> {formatDate(activity.date)}
            </span>
          )}
        </div>
        <h3 className="font-heading text-base font-semibold leading-snug text-charcoal">
          {activity.title}
        </h3>
        {activity.description && (
          <p className="mt-1 line-clamp-2 text-sm text-charcoal/70">{activity.description}</p>
        )}
        {activity.notes && (
          <p className="mt-2 line-clamp-2 text-xs italic text-muted-foreground">“{activity.notes}”</p>
        )}
      </div>
    </div>
  );
}
