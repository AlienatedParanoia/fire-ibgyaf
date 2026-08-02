import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Removes a user for good. Deleting only the public.users row would leave the
 * auth account behind — the person could still sign in with no profile and
 * could never re-register, because their email stays taken. Dropping the auth
 * user cascades the profile (and everything hanging off it) away.
 */
export async function POST(req: NextRequest) {
  const { authUser, profile } = await getCurrentUser();
  if (!authUser) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admins only" }, { status: 403 });
  }

  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  if (id === authUser.id) {
    return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 500 });
  }

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
