import { getSupabaseServer, getCurrentUser } from "@/lib/supabase/server";
import { CompetitionsBrowser } from "@/components/competitions/competitions-browser";
import type { Competition } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = getSupabaseServer();
  const { authUser } = await getCurrentUser();
  if (!supabase) return { competitions: [] as Competition[], savedIds: [] as string[], loggedIn: false };

  const { data: competitions } = await supabase
    .from("competitions")
    .select("*")
    .eq("is_approved", true)
    .order("is_featured", { ascending: false })
    .order("deadline", { ascending: true });

  let savedIds: string[] = [];
  if (authUser) {
    const { data: saved } = await supabase
      .from("participation")
      .select("competition_id")
      .eq("user_id", authUser.id);
    savedIds = (saved ?? []).map((s) => s.competition_id).filter(Boolean) as string[];
  }

  return {
    competitions: (competitions ?? []) as Competition[],
    savedIds,
    loggedIn: !!authUser,
  };
}

export default async function CompetitionsPage() {
  const { competitions, savedIds, loggedIn } = await getData();
  return (
    <div className="container py-10">
      <header className="mb-8 border-b border-ink/10 pb-6">
        <p className="mb-2 font-hand text-[20px] text-coral" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>
          {competitions.length} live opportunities
        </p>
        <h1 className="font-heading text-4xl font-medium text-ink">
          Competitions<span className="text-coral">.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-[17px] text-ink-soft">
          Browse every competition open to Singapore students. Filter by category, region,
          format, and deadline to find your next challenge.
        </p>
      </header>
      <CompetitionsBrowser
        initialCompetitions={competitions}
        initialSavedIds={savedIds}
        loggedIn={loggedIn}
      />
    </div>
  );
}
