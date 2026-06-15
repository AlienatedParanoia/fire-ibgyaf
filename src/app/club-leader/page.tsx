import { requireUser } from "@/lib/auth";
import { ClubLeaderDashboard } from "@/components/club-leader/club-leader-dashboard";
import type { Club, Competition, AppUser } from "@/lib/types";

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

  let members: AppUser[] = [];
  if (club) {
    const { data: parts } = await supabase
      .from("participation")
      .select("user_id, users(*)")
      .eq("club_id", (club as Club).id);
    members = (parts ?? [])
      .map((p: { users: AppUser | AppUser[] | null }) =>
        Array.isArray(p.users) ? p.users[0] : p.users
      )
      .filter((u): u is AppUser => !!u);
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
      />
    </div>
  );
}
