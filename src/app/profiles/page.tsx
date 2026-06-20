import Link from "next/link";
import { GraduationCap, School, FolderHeart, ArrowRight } from "lucide-react";
import { getSupabaseServer, getCurrentUser } from "@/lib/supabase/server";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PublicProfile {
  id: string;
  full_name: string | null;
  school: string | null;
  grade: string | null;
}

async function getData() {
  const supabase = getSupabaseServer();
  const { profile } = await getCurrentUser();
  if (!supabase) return { profiles: [] as PublicProfile[], counts: {} as Record<string, number>, me: profile ?? null };

  const { data: profiles } = await supabase
    .from("public_portfolios")
    .select("*")
    .order("full_name", { ascending: true });

  const list = (profiles ?? []) as PublicProfile[];

  // Activity counts for each public portfolio (readable via RLS)
  const counts: Record<string, number> = {};
  if (list.length) {
    const { data: acts } = await supabase
      .from("custom_activities")
      .select("user_id")
      .in("user_id", list.map((p) => p.id));
    for (const a of (acts ?? []) as { user_id: string }[]) {
      counts[a.user_id] = (counts[a.user_id] ?? 0) + 1;
    }
  }

  return { profiles: list, counts, me: profile ?? null };
}

export default async function ProfilesPage() {
  const { profiles, counts, me } = await getData();

  return (
    <div className="container py-10">
      <header className="mb-8">
        <p className="mb-2 inline-block font-hand text-[20px] text-coral" style={{ transform: "rotate(-1deg)" }}>
          {profiles.length} public {profiles.length === 1 ? "portfolio" : "portfolios"}
        </p>
        <h1 className="font-heading text-4xl font-medium text-ink">
          Profiles<span className="text-coral">.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-[17px] text-ink-soft">
          Browse what other students across Singapore have been up to — their competitions, clubs,
          and achievements, all in one place.
        </p>
      </header>

      {/* your own portfolio */}
      {me && (
        <Link
          href="/portfolio"
          className="mb-8 flex items-center justify-between gap-4 rounded-[16px] border-[1.5px] border-ink/12 bg-panel p-5 shadow-hard-card transition-all hover:-translate-y-0.5 hover:shadow-hard-hover"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral font-heading font-medium text-paper">
              {initials(me.full_name || me.email)}
            </div>
            <div>
              <p className="font-heading text-lg font-medium text-ink">Your portfolio</p>
              <p className="text-sm text-ink-faint">
                {me.is_portfolio_public ? "Public — anyone can view it" : "Private — only you can see it"}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-coral">
            Manage <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      )}

      {profiles.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-beige text-ink">
            <FolderHeart className="h-7 w-7" />
          </div>
          <h3 className="font-heading text-2xl font-medium text-ink">No public portfolios yet</h3>
          <p className="mt-2 text-ink-faint">
            Once students make their portfolios public, they&apos;ll show up here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <Link
              key={p.id}
              href={`/portfolio/${p.id}`}
              className="group flex h-full flex-col rounded-[16px] border-[1.5px] border-ink/12 bg-panel p-5 shadow-hard-card transition-all hover:-translate-y-0.5 hover:shadow-hard-hover"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-heading font-medium text-paper">
                  {initials(p.full_name)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-heading text-lg font-medium text-ink group-hover:text-coral">
                    {p.full_name || "Student"}
                  </h3>
                  <p className="text-xs text-ink-faint">
                    {counts[p.id] ?? 0} {counts[p.id] === 1 ? "activity" : "activities"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1.5 text-sm text-ink-soft">
                {p.school && (
                  <span className="flex items-center gap-1.5">
                    <School className="h-3.5 w-3.5 text-ink-faint" /> {p.school}
                  </span>
                )}
                {p.grade && (
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-ink-faint" /> {p.grade}
                  </span>
                )}
              </div>

              <span className="mt-4 inline-flex items-center gap-1 text-[13.5px] font-semibold text-ink-faint transition-colors group-hover:text-coral">
                View portfolio <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
