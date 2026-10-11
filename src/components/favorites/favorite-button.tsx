"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FavoriteType } from "@/lib/types";
import { useFavorites } from "./favorites-provider";

/** Heart toggle for saving a club or competition. Safe to nest inside clickable cards. */
export function FavoriteButton({
  type,
  id,
  className,
}: {
  type: FavoriteType;
  id: string;
  className?: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const on = isFavorite(type, id);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Remove from saved" : "Save for later"}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        void toggle(type, id);
      }}
      onKeyDown={(e) => e.stopPropagation()}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 bg-panel/90 transition-colors hover:bg-paper",
        on ? "text-ember" : "text-ink-faint hover:text-ember",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", on && "fill-current")} />
    </button>
  );
}
