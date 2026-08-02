import { requireUser } from "@/lib/auth";
import { ClubLeaderDashboard, type ClubMember } from "@/components/club-leader/club-leader-dashboard";
import type { Club, Competition } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ClubLeaderPage() {
  const { authUser, supabase } = await requireUser(["club_leader", "admin"]);
  const uid = authUser!.id;

  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("leader_id", uid)
    .maybeSingle();

  const { data: comps } = await supabase
    .from("competitions")
    .select("*")
    .eq("submitted_by", uid)
    .order("created_at", { ascending: false });

  let members: ClubMember[] = [];
  let membersFailed = false;
  if (club) {
    // Joining users(*) stays hidden by the "users read own or admin" policy, so
    // the roster comes from a definer RPC scoped to this club's leader.
    const { data, error } = await supabase.rpc("club_members", { club: (club as Club).id });
    // A failed read must not render as a club nobody has joined.
    membersFailed = !!error;
    members = (data ?? []) as ClubMember[];
  }

  return (
    <div className="container py-10">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">Club Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your club profile, list competitions, and see who&apos;s joined.
        </p>
      </header>
      <ClubLeaderDashboard
        userId={uid}
        initialClub={(club as Club) ?? null}
        initialComps={(comps ?? []) as Competition[]}
        members={members}
        membersFailed={membersFailed}
      />
    </div>
  );
}
