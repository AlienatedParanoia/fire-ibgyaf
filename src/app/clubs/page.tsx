import { unstable_cache } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/server";
import { getSupabasePublic } from "@/lib/supabase/public";
import { ClubsGrid } from "@/components/clubs/clubs-grid";
import { CLUB_PUBLIC_COLUMNS, CLUB_CONTACT_COLUMNS } from "@/lib/clubs";
import type { Club, ClubRole, Competition } from "@/lib/types";

export const dynamic = "force-dynamic";

// Public, viewer-agnostic data — cached so navigating here doesn't hit the DB
// on every visit. Revalidates every 60s (admin edits appear within a minute).
const getPublicClubs = unstable_cache(
  async () => {
    const supabase = getSupabasePublic();
    if (!supabase) {
      return { clubs: [] as Club[], compsByClub: {} as Record<string, Competition[]>, teamByClub: {} as Record<string, ClubRole[]> };
    }

    const { data: clubs } = await supabase
      .from("clubs")
      .select(CLUB_PUBLIC_COLUMNS)
      .eq("is_approved", true)
      .order("member_count", { ascending: false })
      .order("name", { ascending: true });
    const clubList = (clubs ?? []) as unknown as Club[];

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
    // Table may not exist until migration-roles-audit.sql is run; an error just means no team data.
    const teamByClub: Record<string, ClubRole[]> = {};
    if (clubList.length) {
      const { data: roles } = await supabase
        .from("club_roles")
        .select("*")
        .in("club_id", clubList.map((c) => c.id));
      for (const r of (roles ?? []) as ClubRole[]) (teamByClub[r.club_id] ??= []).push(r);
    }
    return { clubs: clubList, compsByClub, teamByClub };
  },
  ["clubs-page"],
  { revalidate: 60 }
);

export default async function ClubsPage() {
  const [{ clubs: publicClubs, compsByClub, teamByClub }, { profile, supabase }] = await Promise.all([
    getPublicClubs(),
    getCurrentUser(),
  ]);
  const isAdmin = profile?.role === "admin";
  const signedIn = !!profile;

  // Contact details are signed-in only, so they can't live in the shared cache above.
  let clubs = publicClubs;
  if (signedIn && supabase) {
    const { data } = await supabase.from("clubs").select(`id, ${CLUB_CONTACT_COLUMNS}`);
    const contacts = new Map(
      ((data ?? []) as unknown as Pick<Club, "id" | "contact_email" | "contact_phone">[]).map((c) => [c.id, c])
    );
    clubs = publicClubs.map((c) => ({ ...c, ...contacts.get(c.id) }));
  }
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
      <ClubsGrid clubs={clubs} compsByClub={compsByClub} teamByClub={teamByClub} isAdmin={isAdmin} signedIn={signedIn} />
    </div>
  );
}
