import { getSupabaseBrowser } from "@/lib/supabase/client";

/**
 * Records an admin action in `admin_audit_log` (admins only, enforced by RLS).
 * Fire-and-forget: a failed audit write must never block or undo the action
 * itself, so errors only reach the console.
 */
export async function logAudit(
  action: string,
  targetType: string,
  targetId: string,
  details: Record<string, unknown> = {}
): Promise<void> {
  try {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    // getSession reads the auth cookie locally — no extra network round-trip.
    const { data } = await supabase.auth.getSession();
    const actorId = data.session?.user.id;
    if (!actorId) return;
    const { error } = await supabase
      .from("admin_audit_log")
      .insert({ actor_id: actorId, action, target_type: targetType, target_id: targetId, details });
    if (error) console.warn("audit log write failed:", error.message);
  } catch (e) {
    console.warn("audit log write failed:", e);
  }
}
