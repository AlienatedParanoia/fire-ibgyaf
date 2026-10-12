import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Self-service account deletion. Drops the auth user (the profile and everything
 * hanging off it cascades away) using the service-role key, after checking that
 * the caller is deleting *their own* account and retyped their email.
 */
export async function POST(req: NextRequest) {
  // Same CSRF stance as /auth/signout: refuse requests initiated from another site.
  if (req.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Cross-site requests are not allowed." }, { status: 403 });
  }

  const { authUser, profile, supabase } = await getCurrentUser();
  if (!authUser || !profile) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  if (!email || email.trim().toLowerCase() !== profile.email.toLowerCase()) {
    return NextResponse.json({ error: "Type your email address exactly to confirm." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 500 });
  }

  // Never let the last admin lock everyone out of the admin panel.
  if (profile.role === "admin") {
    const { count } = await admin
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) <= 1) {
      return NextResponse.json(
        { error: "You're the only admin. Promote someone else before deleting your account." },
        { status: 400 }
      );
    }
  }

  const { error } = await admin.auth.admin.deleteUser(authUser.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // The auth user is gone; clear the session cookies too (best effort).
  try {
    await supabase?.auth.signOut();
  } catch {
    /* the client follows up with /auth/signout */
  }
  return NextResponse.json({ ok: true });
}
