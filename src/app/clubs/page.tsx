import { getSupabaseServer, getCurrentUser } from "@/lib/supabase/server";
import { ClubsGrid } from "@/components/clubs/clubs-grid";
import type { Club, Competition } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = getSupabaseServer();
  const { profile } = await getCurrentUser();
  if (!supabase) return { clubs: [] as Club[], compsByClub: {} as Record<string, Competition[]>, isAdmin: false };

  const { data: clubs } = await supabase
    .from("clubs")
    .select("*")
    .eq("is_approved", true)
    .order("member_count", { ascending: false });

  const clubList = (clubs ?? []) as Club[];

  // Competitions run by these clubs, grouped by club_id
  const compsByClub: Record<string, Competition[]> = {};
  if (clubList.length) {
    const { data: comps } = await supabase
      .from("competitions")
      .select("*")
      .eq("is_approved", true)
      .in("club_id", clubList.map((c) => c.id))
      .order("deadline", { ascending: true });

    for (const comp of (comps ?? []) as Competition[]) {
      if (!comp.club_id) continue;
      (compsByClub[comp.club_id] ??= []).push(comp);
    }
  }

  return { clubs: clubList, compsByClub, isAdmin: profile?.role === "admin" };
}

export default async function ClubsPage() {
  const { clubs, compsByClub, isAdmin } = await getData();
  return (
    <div className="container py-10">
      <header className="mb-8">
        <p
          className="mb-2 inline-block font-hand text-[20px] text-coral"
          style={{ transform: "rotate(-1deg)" }}
        >
          {clubs.length} student communities
        </p>
        <h1 className="font-heading text-4xl font-medium text-ink">
          Clubs<span className="text-coral">.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-[17px] text-ink-soft">
          Join clubs across every school, not just your own. Browse by category, see what they
          compete in, and join in a tap.
        </p>
      </header>
      <ClubsGrid clubs={clubs} compsByClub={compsByClub} isAdmin={isAdmin} />
    </div>
  );
}
