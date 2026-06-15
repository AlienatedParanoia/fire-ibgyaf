import { getSupabaseServer } from "@/lib/supabase/server";
import { ClubsGrid } from "@/components/clubs/clubs-grid";
import type { Club } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getClubs() {
  const supabase = getSupabaseServer();
  if (!supabase) return [] as Club[];
  const { data } = await supabase
    .from("clubs")
    .select("*")
    .eq("is_approved", true)
    .order("member_count", { ascending: false });
  return (data ?? []) as Club[];
}

export default async function ClubsPage() {
  const clubs = await getClubs();
  return (
    <div className="container py-10">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">Clubs</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Discover {clubs.length} student clubs and societies. Join a community that matches your
          passion.
        </p>
      </header>
      <ClubsGrid clubs={clubs} />
    </div>
  );
}
