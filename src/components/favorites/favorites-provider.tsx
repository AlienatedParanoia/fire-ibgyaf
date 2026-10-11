"use client";

import * as React from "react";
import { toast } from "sonner";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { FavoriteType } from "@/lib/types";

interface FavoritesCtx {
  isFavorite: (type: FavoriteType, id: string) => boolean;
  toggle: (type: FavoriteType, id: string) => Promise<void>;
}

const Ctx = React.createContext<FavoritesCtx>({
  isFavorite: () => false,
  toggle: async () => {},
});

const key = (type: FavoriteType, id: string) => `${type}:${id}`;

/**
 * Loads the signed-in user's saved clubs/competitions once and shares them with
 * every heart button on the page, instead of each button querying on its own.
 */
export function FavoritesProvider({ userId, children }: { userId: string | null; children: React.ReactNode }) {
  const [saved, setSaved] = React.useState<Set<string>>(new Set());
  const inFlight = React.useRef(new Set<string>());

  React.useEffect(() => {
    setSaved(new Set());
    if (!userId) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from("favorites")
      .select("item_type, item_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (cancelled || !data) return;
        setSaved(new Set(data.map((f) => key(f.item_type as FavoriteType, f.item_id as string))));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggle = React.useCallback(
    async (type: FavoriteType, id: string) => {
      if (!userId) {
        toast.error("Log in to save favorites", {
          action: { label: "Log in", onClick: () => (window.location.href = "/login") },
        });
        return;
      }
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        toast.error("Supabase not configured.");
        return;
      }
      const k = key(type, id);
      if (inFlight.current.has(k)) return;
      inFlight.current.add(k);

      const wasSaved = saved.has(k);
      // Optimistic flip, rolled back if the write fails.
      setSaved((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(k);
        else next.add(k);
        return next;
      });
      const { error } = wasSaved
        ? await supabase.from("favorites").delete().eq("user_id", userId).eq("item_type", type).eq("item_id", id)
        : await supabase.from("favorites").insert({ user_id: userId, item_type: type, item_id: id });
      inFlight.current.delete(k);
      // 23505 = already saved in another tab; the optimistic state is already right.
      if (error && error.code !== "23505") {
        setSaved((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(k);
          else next.delete(k);
          return next;
        });
        toast.error(error.message);
      }
    },
    [userId, saved]
  );

  const value = React.useMemo<FavoritesCtx>(
    () => ({ isFavorite: (type, id) => saved.has(key(type, id)), toggle }),
    [saved, toggle]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useFavorites = () => React.useContext(Ctx);
