import { unstable_cache } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/server";
import { getSupabasePublic } from "@/lib/supabase/public";
import { ClubsGrid } from "@/components/clubs/clubs-grid";
import type { Club, Competition } from "@/lib/types";

export const dynamic = "force-dynamic";

// Public, viewer-agnostic data — cached so navigating here doesn't hit the DB
// on every visit. Revalidates every 60s (admin edits appear within a minute).
const getPublicClubs = unstable_cache(
  async () => {
    const supabase = getSupabasePublic();
    if (!supabase) return { clubs: [] as Club[], compsByClub: {} as Record<string, Competition[]> };

    const { data: clubs } = await supabase
      .from("clubs")
      .select("*")
      .eq("is_approved", true)
      .order("member_count", { ascending: false });
    const clubList = (clubs ?? []) as Club[];

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
    return { clubs: clubList, compsByClub };
  },
  ["clubs-page"],
  { revalidate: 60 }
);

export default async function ClubsPage() {
  const [{ clubs, compsByClub }, { profile }] = await Promise.all([getPublicClubs(), getCurrentUser()]);
  const isAdmin = profile?.role === "admin";
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
