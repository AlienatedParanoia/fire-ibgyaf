"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Flame,
  Bookmark,
  BookmarkCheck,
  Building2,
  CalendarClock,
  Trophy,
  ExternalLink,
  Share2,
  SearchX,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Countdown } from "@/components/countdown";
import { CategoryBadge, FormatBadge, RegionBadge } from "./badges";
import { CATEGORIES, cn, daysUntil, deadlineUrgency, formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Competition } from "@/lib/types";

type SortKey = "deadline" | "newest" | "saved";

export function CompetitionsBrowser({
  initialCompetitions,
  initialSavedIds,
  loggedIn,
}: {
  initialCompetitions: Competition[];
  initialSavedIds: string[];
  loggedIn: boolean;
}) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [format, setFormat] = React.useState("");
  const [deadline, setDeadline] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("deadline");
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set(initialSavedIds));
  const [active, setActive] = React.useState<Competition | null>(null);
  const [savingId, setSavingId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    let list = initialCompetitions.filter((c) => {
      if (query) {
        const q = query.toLowerCase();
        const hay = `${c.title} ${c.organizer ?? ""} ${c.description ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (category && c.category !== category) return false;
      if (region && c.region !== region && c.region !== "Both") return false;
      if (format && c.format !== format) return false;
      if (deadline) {
        const d = daysUntil(c.deadline);
        if (d === null || d < 0) return false;
        if (deadline === "week" && d > 7) return false;
        if (deadline === "month" && d > 30) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      // featured always first
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      if (sort === "deadline") {
        const da = daysUntil(a.deadline) ?? 99999;
        const db = daysUntil(b.deadline) ?? 99999;
        return da - db;
      }
      if (sort === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // "saved" proxy: featured first then newest (cross-user counts are RLS-protected)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [initialCompetitions, query, category, region, format, deadline, sort]);

  async function toggleSave(comp: Competition, e?: React.MouseEvent) {
    e?.stopPropagation();
    if (!loggedIn) {
      toast.error("Log in to save competitions", {
        action: { label: "Log in", onClick: () => (window.location.href = "/login") },
      });
      return;
    }
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      toast.error("Supabase not configured.");
      return;
    }
    setSavingId(comp.id);
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) {
      setSavingId(null);
      toast.error("Please log in again.");
      return;
    }
    const already = savedIds.has(comp.id);
    try {
      if (already) {
        await supabase.from("participation").delete().eq("user_id", uid).eq("competition_id", comp.id);
        setSavedIds((s) => {
          const n = new Set(s);
          n.delete(comp.id);
          return n;
        });
        toast.success("Removed from your tracker");
      } else {
        await supabase
          .from("participation")
          .insert({ user_id: uid, competition_id: comp.id, status: "interested" });
        await supabase.from("analytics_events").insert({
          event_type: "competition_saved",
          user_id: uid,
          reference_id: comp.id,
        });
        setSavedIds((s) => new Set(s).add(comp.id));
        toast.success("Saved to your tracker 🔥");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSavingId(null);
    }
  }

  function share(comp: Competition) {
    const url = `${window.location.origin}/competitions?c=${comp.id}`;
    if (navigator.share) {
      navigator.share({ title: comp.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  }

  return (
    <div>
      {/* filter bar */}
      <div className="sticky top-16 z-30 -mx-2 mb-6 rounded-xl border border-charcoal/10 bg-white/90 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search competitions, organisers…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">All regions</option>
              <option value="Singapore">Singapore</option>
              <option value="Global">Global</option>
              <option value="Both">Both</option>
            </Select>
            <Select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="">All formats</option>
              <option value="online">Online</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </Select>
            <Select value={deadline} onChange={(e) => setDeadline(e.target.value)}>
              <option value="">Any deadline</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </Select>
            <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="deadline">Sort: Deadline</option>
              <option value="newest">Sort: Newest</option>
              <option value="saved">Sort: Featured</option>
            </Select>
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Showing <span className="font-semibold text-charcoal">{filtered.length}</span> competition
        {filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<SearchX className="h-7 w-7" />}
          title="No competitions match your filters"
          description="Try clearing a filter or broadening your search."
          actionLabel="Suggest a competition"
          actionHref="/submit"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((comp, i) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
            >
              <CompetitionCard
                comp={comp}
                saved={savedIds.has(comp.id)}
                saving={savingId === comp.id}
                onSave={(e) => toggleSave(comp, e)}
                onOpen={() => setActive(comp)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* detail modal */}
      <Dialog open={!!active} onClose={() => setActive(null)} className="max-w-3xl">
        {active && (
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {active.is_featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-fire px-2.5 py-0.5 text-xs font-semibold text-white">
                  <Flame className="h-3 w-3" /> Featured
                </span>
              )}
              <CategoryBadge category={active.category} />
              <FormatBadge format={active.format} />
              <RegionBadge region={active.region} />
            </div>
            <h2 className="pr-6 font-heading text-2xl font-bold text-charcoal">{active.title}</h2>
            {active.organizer && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" /> {active.organizer}
              </p>
            )}

            <div className="mt-5 rounded-xl bg-muted/60 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Registration closes in
              </p>
              <Countdown deadline={active.deadline} />
              <p className="mt-2 text-xs text-muted-foreground">
                Deadline: {formatDate(active.deadline)} · Event: {formatDate(active.event_date)}
              </p>
            </div>

            {active.description && (
              <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-charcoal/90">
                {active.description}
              </p>
            )}

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {active.eligibility && (
                <Detail label="Eligibility" value={active.eligibility} />
              )}
              {active.prize && (
                <Detail
                  label="Prize"
                  value={active.prize}
                  icon={<Trophy className="h-4 w-4 text-fire" />}
                />
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              {active.registration_link && (
                <a
                  href={active.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ className: "flex-1" })}
                >
                  Register now <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <Button
                variant={savedIds.has(active.id) ? "subtle" : "outline"}
                onClick={(e) => toggleSave(active, e)}
              >
                {savedIds.has(active.id) ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" /> Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" /> Save
                  </>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => share(active)} aria-label="Share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-charcoal/10 p-3">
      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm text-charcoal">{value}</dd>
    </div>
  );
}

function CompetitionCard({
  comp,
  saved,
  saving,
  onSave,
  onOpen,
}: {
  comp: Competition;
  saved: boolean;
  saving: boolean;
  onSave: (e: React.MouseEvent) => void;
  onOpen: () => void;
}) {
  const urgency = deadlineUrgency(comp.deadline);
  return (
    <div
      onClick={onOpen}
      className={cn(
        "group flex h-full cursor-pointer flex-col rounded-xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
        comp.is_featured ? "border-fire/40 ring-1 ring-fire/20" : "border-charcoal/10"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {comp.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-fire px-2 py-0.5 text-[11px] font-semibold text-white">
              <Flame className="h-3 w-3" /> Featured
            </span>
          )}
          <CategoryBadge category={comp.category} />
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          aria-label={saved ? "Unsave" : "Save"}
          className={cn(
            "shrink-0 rounded-lg p-2 transition-colors",
            saved ? "bg-fire-50 text-fire" : "text-charcoal/40 hover:bg-muted hover:text-fire"
          )}
        >
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>

      <h3 className="font-heading text-base font-semibold leading-snug text-charcoal group-hover:text-fire">
        {comp.title}
      </h3>
      {comp.organizer && (
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Building2 className="h-3 w-3" /> {comp.organizer}
        </p>
      )}
      {comp.description && (
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-charcoal/70">{comp.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <FormatBadge format={comp.format} />
        <RegionBadge region={comp.region} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-charcoal/5 pt-3">
        <span className={cn("flex items-center gap-1 text-sm font-medium", urgency.color)}>
          <CalendarClock className="h-4 w-4" /> {urgency.label}
        </span>
        <span className="text-xs font-medium text-electric group-hover:underline">View details →</span>
      </div>
    </div>
  );
}
