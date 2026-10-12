import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Admin-only: emails someone an invitation to run a club. They set their own
 * password from the link; until they accept, nothing is sent from their account and
 * they can ignore the email. On send, the new account is made a club leader and
 * attached to the club (only if the club has no leader yet).
 */
export async function POST(req: NextRequest) {
  if (req.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Cross-site requests are not allowed." }, { status: 403 });
  }
  const { authUser, profile } = await getCurrentUser();
  if (!authUser) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (profile?.role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });

  const { clubId, email } = (await req.json().catch(() => ({}))) as { clubId?: string; email?: string };
  const address = email?.trim().toLowerCase() ?? "";
  if (!clubId || !UUID.test(clubId)) return NextResponse.json({ error: "Missing club." }, { status: 400 });
  if (!EMAIL.test(address)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 500 });
  }

  const { data: club } = await admin
    .from("clubs")
    .select("id, name, school, leader_id")
    .eq("id", clubId)
    .maybeSingle();
  if (!club) return NextResponse.json({ error: "Club not found." }, { status: 404 });
  if (club.leader_id) {
    return NextResponse.json({ error: `${club.name} already has a leader.` }, { status: 409 });
  }

  const { data: existing } = await admin.from("users").select("id").eq("email", address).maybeSingle();
  if (existing) {
    return NextResponse.json(
      { error: "That email already has an account. Change their role in Users instead." },
      { status: 409 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://projectfire.dev";
  const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(address, {
    redirectTo: `${siteUrl}/auth/confirm?next=/club-leader`,
    data: { school: club.school ?? "" },
  });
  if (error || !invited.user) {
    return NextResponse.json({ error: error?.message ?? "Could not send the invitation." }, { status: 500 });
  }

  const uid = invited.user.id;
  // handle_new_user created the profile as a student; promote it and attach the club.
  const [roleRes, clubRes] = await Promise.all([
    admin.from("users").update({ role: "club_leader" }).eq("id", uid),
    admin.from("clubs").update({ leader_id: uid }).eq("id", clubId).is("leader_id", null),
  ]);
  if (roleRes.error || clubRes.error) {
    return NextResponse.json(
      { error: "Invitation sent, but linking the account to the club failed. Set it in Admin → Manage Clubs." },
      { status: 500 }
    );
  }

  await admin.from("admin_audit_log").insert({
    actor_id: authUser.id,
    action: "club.invite_leader",
    target_type: "club",
    target_id: clubId,
    details: { club: club.name, email: address },
  });

  return NextResponse.json({ ok: true });
}
