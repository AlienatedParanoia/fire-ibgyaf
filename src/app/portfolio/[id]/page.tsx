import Link from "next/link";
import { Lock, GraduationCap, School, FolderHeart } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ActivityCard } from "@/components/portfolio/activity-card";
import { buttonVariants } from "@/components/ui/button";
import { initials } from "@/lib/utils";
import type { CustomActivity } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PublicProfile {
  id: string;
  full_name: string | null;
  school: string | null;
  grade: string | null;
}

async function getPublicPortfolio(id: string) {
  const supabase = getSupabaseServer();
  if (!supabase) return { profile: null as PublicProfile | null, activities: [] as CustomActivity[] };
  const { data: profile } = await supabase
    .from("public_portfolios")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!profile) return { profile: null, activities: [] };
  const { data: activities } = await supabase
    .from("custom_activities")
    .select("*")
    .eq("user_id", id)
    .order("date", { ascending: false });
  return { profile: profile as PublicProfile, activities: (activities ?? []) as CustomActivity[] };
}

export default async function PublicPortfolioPage({ params }: { params: { id: string } }) {
  const { profile, activities } = await getPublicPortfolio(params.id);

  if (!profile) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-charcoal/5 text-charcoal/50">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">This portfolio is private</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          The owner hasn&apos;t made this portfolio public, or it doesn&apos;t exist.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-6" })}>
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* hero */}
      <div className="fire-gradient">
        <div className="container py-12">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white/30 bg-white/15 font-heading text-2xl font-bold text-white backdrop-blur">
              {initials(profile.full_name)}
            </span>
            <div>
              <h1 className="font-heading text-3xl font-bold text-white">
                {profile.full_name || "Student"}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-4 text-sm text-white/85">
                {profile.school && (
                  <span className="flex items-center gap-1.5">
                    <School className="h-4 w-4" /> {profile.school}
                  </span>
                )}
                {profile.grade && (
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" /> {profile.grade}
                  </span>
                )}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-white/80">
            Extracurricular portfolio · powered by F.I.R.E
          </p>
        </div>
      </div>

      <div className="container py-10">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-charcoal/15 bg-muted/40 px-6 py-16 text-center">
            <FolderHeart className="mb-3 h-8 w-8 text-fire/40" />
            <p className="text-sm text-muted-foreground">No activities showcased yet.</p>
          </div>
        ) : (
          <>
            <h2 className="mb-5 font-heading text-xl font-bold text-charcoal">
              Activities &amp; achievements ({activities.length})
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((a) => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
