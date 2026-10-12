import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Users2, Trophy, CalendarClock } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { CLUB_PUBLIC_COLUMNS } from "@/lib/clubs";
import { CategoryBadge } from "@/components/competitions/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, deadlineUrgency } from "@/lib/utils";
import type { Club, Competition } from "@/lib/types";

export const metadata: Metadata = { title: "For You — F.I.R.E" };
export const dynamic = "force-dynamic";

type Scored = { item_id: string; total_score: number; reasons: string[] };

export default async function ForYouPage() {
  const { supabase } = await requireUser();

  const [clubScores, compScores] = await Promise.all([
    supabase.rpc("get_recommendations", { p_item_type: "club", p_limit: 6 }),
    supabase.rpc("get_recommendations", { p_item_type: "competition", p_limit: 6 }),
  ]);
  // The function only exists once migration-ai-tracking.sql has been run.
  const unavailable = !!clubScores.error && !!compScores.error;

  const clubHits = (clubScores.data ?? []) as Scored[];
  const compHits = (compScores.data ?? []) as Scored[];

  const [clubsRes, compsRes] = await Promise.all([
    clubHits.length
      ? supabase.from("clubs").select(CLUB_PUBLIC_COLUMNS).in("id", clubHits.map((h) => h.item_id))
      : Promise.resolve({ data: [] }),
    compHits.length
      ? supabase.from("competitions").select("*").in("id", compHits.map((h) => h.item_id))
      : Promise.resolve({ data: [] }),
  ]);
  const clubById = new Map(((clubsRes.data ?? []) as unknown as Club[]).map((c) => [c.id, c]));
  const compById = new Map(((compsRes.data ?? []) as Competition[]).map((c) => [c.id, c]));

  return (
    <div className="container py-10">
      <header className="mb-8">
        <p className="mb-2 inline-flex items-center gap-1.5 font-hand text-[20px] text-coral">
          <Sparkles className="h-4 w-4" /> picked for you
        </p>
        <h1 className="font-heading text-4xl font-medium text-ink">
          For You<span className="text-coral">.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-[17px] text-ink-soft">
          Clubs and competitions matched to your interests and what you&apos;ve been looking at. The more you
          browse and save, the better this gets.
        </p>
      </header>

      {unavailable ? (
        <EmptyState
          icon={<Sparkles className="h-7 w-7" />}
          title="Recommendations aren't switched on yet"
          description="Check back soon."
        />
      ) : (
        <>
          <Section title="Clubs to join" icon={<Users2 className="h-5 w-5 text-electric" />} empty={clubHits.length === 0}>
            {clubHits.map((h) => {
              const c = clubById.get(h.item_id);
              if (!c) return null;
              return (
                <Card key={c.id} href={`/clubs/${c.id}`} reasons={h.reasons}>
                  <div className="mb-2 flex items-center gap-2">
                    <CategoryBadge category={c.category} />
                    {c.is_open === false && <span className="text-xs text-ink-faint">Closed</span>}
                  </div>
                  <h3 className="font-heading text-lg font-medium text-ink">{c.name}</h3>
                  {c.description && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{c.description}</p>}
                </Card>
              );
            })}
          </Section>

          <Section
            title="Competitions to try"
            icon={<Trophy className="h-5 w-5 text-fire" />}
            empty={compHits.length === 0}
          >
            {compHits.map((h) => {
              const k = compById.get(h.item_id);
              if (!k) return null;
              const u = deadlineUrgency(k.deadline);
              return (
                <Card key={k.id} href={`/competitions?c=${k.id}`} reasons={h.reasons}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <CategoryBadge category={k.category} />
                    <span className={cn("flex items-center gap-1 text-xs font-semibold", u.color)}>
                      <CalendarClock className="h-3.5 w-3.5" /> {u.label}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-medium text-ink">{k.title}</h3>
                  {k.organizer && <p className="mt-0.5 text-xs text-ink-faint">{k.organizer}</p>}
                </Card>
              );
            })}
          </Section>
        </>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  empty,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 flex items-center gap-2 font-heading text-2xl font-medium text-ink">
        {icon} {title}
      </h2>
      {empty ? (
        <p className="rounded-xl border border-dashed border-ink/15 bg-paper p-6 text-sm text-ink-faint">
          Nothing to suggest right now — you&apos;ve either joined or saved everything that fits, or there&apos;s
          nothing new yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      )}
    </section>
  );
}

function Card({
  href,
  reasons,
  children,
}: {
  href: string;
  reasons: string[];
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex h-full flex-col rounded-2xl border-[1.5px] border-ink/12 bg-panel p-5 shadow-hard-card transition-all hover:-translate-y-0.5 hover:shadow-hard-hover"
    >
      <div className="flex-1">{children}</div>
      {reasons.length > 0 && (
        <ul className="mt-4 space-y-1 border-t border-ink/8 pt-3">
          {reasons.slice(0, 2).map((r) => (
            <li key={r} className="flex items-center gap-1.5 text-xs text-coral">
              <Sparkles className="h-3 w-3 shrink-0" /> {r}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
