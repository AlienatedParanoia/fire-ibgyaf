import { getSupabaseBrowser } from "@/lib/supabase/client";

export type InteractionAction = "view" | "click" | "save" | "register" | "join";
export type InteractionItem = "club" | "competition";

// A modal reopened or a page re-rendered shouldn't count as a second view.
const seenThisSession = new Set<string>();

/**
 * Records that the signed-in student interacted with a club or competition. Feeds
 * item_popularity and the For You recommendations. Fire-and-forget and silent: tracking
 * must never block or break the UI, and signed-out visitors are simply not tracked.
 */
export async function trackInteraction(
  itemType: InteractionItem,
  itemId: string,
  action: InteractionAction
): Promise<void> {
  try {
    if (action === "view" || action === "click") {
      const key = `${action}:${itemType}:${itemId}`;
      if (seenThisSession.has(key)) return;
      seenThisSession.add(key);
    }
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) return;
    await supabase
      .from("user_interactions")
      .insert({ user_id: uid, item_type: itemType, item_id: itemId, action_type: action });
  } catch {
    /* tracking is best-effort */
  }
}
