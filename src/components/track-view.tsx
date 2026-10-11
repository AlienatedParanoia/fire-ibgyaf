"use client";

import * as React from "react";
import { trackInteraction, type InteractionItem } from "@/lib/track";

/** Renders nothing; records one "view" of a club/competition when it mounts. */
export function TrackView({ type, id }: { type: InteractionItem; id: string }) {
  React.useEffect(() => {
    void trackInteraction(type, id, "view");
  }, [type, id]);
  return null;
}
