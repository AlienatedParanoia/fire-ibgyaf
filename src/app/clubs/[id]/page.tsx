import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, User, Calendar, Users2, ArrowLeft, CalendarClock } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { CategoryBadge } from "@/components/competitions/badges";
import { JoinClubButton } from "@/components/clubs/join-club-button";
import { deadlineUrgency, formatDate, cn } from "@/lib/utils";
import type { Club, Competition } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getClub(id: string) {
  const supabase = getSupabaseServer();
  if (!supabase) return { club: null as Club | null, comps: [] as Competition[] };
  const { data: club } = await supabase.from("clubs").select("*").eq("id", id).maybeSingle();
  const { data: comps } = await supabase
    .from("competitions")
    .select("*")
    .eq("club_id", id)
    .eq("is_approved", true)
    .order("deadline", { ascending: true });
  return { club: club as Club | null, comps: (comps ?? []) as Competition[] };
}

export default async function ClubDetailPage({ params }: { params: { id: string } }) {
  const { club, comps } = await getClub(params.id);
  if (!club) notFound();

  return (
    <div>
      <div className="relative h-48 bg-gradient-to-br from-fire to-electric sm:h-60">
        {club.banner_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={club.banner_url} alt="" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-charcoal/20" />
      </div>

      <div className="container -mt-16 pb-16">
        <Link
          href="/clubs"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> All clubs
        </Link>

        <div className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fire to-electric font-heading text-2xl font-bold text-white shadow">
                {club.name.charAt(0)}
              </div>
              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <CategoryBadge category={club.category} />
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users2 className="h-4 w-4" /> {club.member_count} members
                  </span>
                </div>
                <h1 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">
                  {club.name}
                </h1>
              </div>
            </div>
            <JoinClubButton clubId={club.id} clubName={club.name} />
          </div>

          {club.description && (
            <p className="mt-6 whitespace-pre-line leading-relaxed text-charcoal/90">
              {club.description}
            </p>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {club.meeting_schedule && (
              <InfoCard icon={<Calendar className="h-4 w-4" />} label="Meets" value={club.meeting_schedule} />
            )}
            {club.contact_person && (
              <InfoCard icon={<User className="h-4 w-4" />} label="Contact" value={club.contact_person} />
            )}
            {club.contact_email && (
              <InfoCard icon={<Mail className="h-4 w-4" />} label="Email" value={club.contact_email} />
            )}
          </div>
        </div>

        {/* club competitions */}
        <section className="mt-10">
          <h2 className="mb-4 font-heading text-xl font-bold text-charcoal">
            Competitions from this club
          </h2>
          {comps.length === 0 ? (
            <p className="rounded-xl border border-dashed border-charcoal/15 bg-muted/40 p-6 text-sm text-muted-foreground">
              This club hasn&apos;t listed any competitions yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {comps.map((c) => {
                const u = deadlineUrgency(c.deadline);
                return (
                  <Link
                    key={c.id}
                    href={`/competitions?c=${c.id}`}
                    className="flex items-center justify-between rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div>
                      <h3 className="font-heading font-semibold text-charcoal">{c.title}</h3>
                      <p className="text-xs text-muted-foreground">{c.organizer}</p>
                    </div>
                    <span className={cn("flex items-center gap-1 text-sm font-medium", u.color)}>
                      <CalendarClock className="h-4 w-4" /> {u.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-charcoal/10 p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon} {label}
      </p>
      <p className="mt-1 text-sm font-medium text-charcoal">{value}</p>
    </div>
  );
}
