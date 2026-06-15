import { requireUser } from "@/lib/auth";
import { PortfolioView } from "@/components/portfolio/portfolio-view";
import type { CustomActivity } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const { authUser, profile, supabase } = await requireUser();
  const uid = authUser!.id;

  const { data: activities } = await supabase
    .from("custom_activities")
    .select("*")
    .eq("user_id", uid)
    .order("date", { ascending: false });

  return (
    <div className="container py-10">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">My Portfolio</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Showcase your achievements and activities — upload a photo as proof for each one, and share
          a public link for applications.
        </p>
      </header>
      <PortfolioView
        userId={uid}
        initialActivities={(activities ?? []) as CustomActivity[]}
        initialPublic={profile?.is_portfolio_public ?? false}
      />
    </div>
  );
}
