import { getSupabaseServer, getCurrentUser } from "@/lib/supabase/server";
import { CompetitionsBrowser } from "@/components/competitions/competitions-browser";
import type { Competition } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = getSupabaseServer();
  const { authUser, profile } = await getCurrentUser();
  if (!supabase)
    return {
      competitions: [] as Competition[],
      savedIds: [] as string[],
      loggedIn: false,
      isAdmin: false,
      interests: [] as string[],
      historyCategories: [] as string[],
      interestCounts: {} as Record<string, number>,
    };

  const { data: competitions } = await supabase
    .from("competitions")
    .select("*")
    .eq("is_approved", true)
    .order("is_featured", { ascending: false })
    .order("deadline", { ascending: true });

  // Social proof: aggregate tracker counts per competition (no PII, via RPC).
  const interestCounts: Record<string, number> = {};
  const { data: counts } = await supabase.rpc("competition_interest_counts");
  for (const row of (counts ?? []) as { competition_id: string; n: number }[]) {
    if (row.competition_id) interestCounts[row.competition_id] = Number(row.n);
  }

  let savedIds: string[] = [];
  let historyCategories: string[] = [];
  if (authUser) {
    const { data: saved } = await supabase
      .from("participation")
      .select("competition_id, competitions(category)")
      .eq("user_id", authUser.id);
    savedIds = (saved ?? []).map((s) => s.competition_id).filter(Boolean) as string[];
    historyCategories = Array.from(
      new Set(
        (saved ?? [])
          .map((s) => {
            // Supabase types the nested relation as an array; at runtime a
            // to-one join is an object — handle both shapes.
            const rel = s.competitions as unknown;
            const comp = Array.isArray(rel) ? rel[0] : rel;
            return (comp as { category: string | null } | null)?.category ?? null;
          })
          .filter(Boolean) as string[]
      )
    );
  }

  return {
    competitions: (competitions ?? []) as Competition[],
    savedIds,
    loggedIn: !!authUser,
    isAdmin: profile?.role === "admin",
    interests: (profile?.interests ?? []) as string[],
    historyCategories,
    interestCounts,
  };
}

export default async function CompetitionsPage() {
  const { competitions, savedIds, loggedIn, isAdmin, interests, historyCategories, interestCounts } =
    await getData();
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
        isAdmin={isAdmin}
        interests={interests}
        historyCategories={historyCategories}
        interestCounts={interestCounts}
      />
    </div>
  );
}
