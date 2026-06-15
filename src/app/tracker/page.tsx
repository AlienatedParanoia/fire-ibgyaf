import { requireUser } from "@/lib/auth";
import { TrackerView } from "@/components/tracker/tracker-view";
import type { Participation } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  const { authUser, supabase } = await requireUser();
  const uid = authUser!.id;

  const { data: participation } = await supabase
    .from("participation")
    .select("*, competitions(*)")
    .eq("user_id", uid)
    .not("competition_id", "is", null)
    .order("created_at", { ascending: false });

  return (
    <div className="container py-10">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">My Tracker</h1>
        <p className="mt-2 text-muted-foreground">
          Track every competition you&apos;re part of. Looking to log your own activities?{" "}
          <a href="/portfolio" className="font-medium text-fire hover:underline">
            Head to your Portfolio
          </a>
          .
        </p>
      </header>
      <TrackerView userId={uid} initialParticipation={(participation ?? []) as Participation[]} />
    </div>
  );
}
