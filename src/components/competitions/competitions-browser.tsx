"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Building2,
  CalendarClock,
  Trophy,
  ExternalLink,
  Share2,
  SearchX,
  Star,
  Pencil,
  Sparkles,
  SlidersHorizontal,
  Flame,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Countdown } from "@/components/countdown";
import { CategoryBadge, FormatBadge, RegionBadge } from "./badges";
import { CompetitionFormDialog } from "./competition-form-dialog";
import { TeammatesPanel } from "./teammates-panel";
import { InterestsDialog } from "@/components/interests-dialog";
import { CATEGORIES, cn, daysUntil, deadlineUrgency, formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Competition } from "@/lib/types";

type SortKey = "foryou" | "deadline" | "newest" | "saved";

/** Rank a competition for the personalised feed — higher is more relevant. */
function forYouScore(c: Competition, interests: Set<string>, history: Set<string>): number {
  let s = 0;
  if (c.category && interests.has(c.category)) s += 100;
  if (c.category && history.has(c.category)) s += 40;
  if (c.is_featured) s += 20;
  const d = daysUntil(c.deadline);
  if (d !== null && d >= 0) s += Math.max(0, 30 - d); // sooner deadlines rank higher
  return s;
}

export function CompetitionsBrowser({
  initialCompetitions,
  initialSavedIds,
  loggedIn,
  isAdmin = false,
  interests = [],
  historyCategories = [],
  interestCounts = {},
}: {
  initialCompetitions: Competition[];
  initialSavedIds: string[];
  loggedIn: boolean;
  isAdmin?: boolean;
  interests?: string[];
  historyCategories?: string[];
  interestCounts?: Record<string, number>;
}) {
  const [competitions, setCompetitions] = React.useState<Competition[]>(initialCompetitions);
  const [userInterests, setUserInterests] = React.useState<string[]>(interests);
  const [interestsOpen, setInterestsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [format, setFormat] = React.useState("");
  const [deadline, setDeadline] = React.useState("");
  // Default to the personalised feed when the student has picked interests.
  const [sort, setSort] = React.useState<SortKey>(interests.length ? "foryou" : "deadline");
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set(initialSavedIds));
  const [active, setActive] = React.useState<Competition | null>(null);
  const [editing, setEditing] = React.useState<Competition | null>(null);
  const [savingId, setSavingId] = React.useState<string | null>(null);

  const forYou = sort === "foryou";

  const filtered = React.useMemo(() => {
    const interestSet = new Set(userInterests);
    const historySet = new Set(historyCategories);
    let list = competitions.filter((c) => {
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
      // The "For You" feed is for discovery: hide closed and already-saved comps.
      if (forYou) {
        const d = daysUntil(c.deadline);
        if (d !== null && d < 0) return false;
        if (savedIds.has(c.id)) return false;
      }
      return true;
    });

    if (forYou) {
      list = [...list].sort(
        (a, b) => forYouScore(b, interestSet, historySet) - forYouScore(a, interestSet, historySet)
      );
      return list;
    }

    list = [...list].sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      if (sort === "deadline") {
        const da = daysUntil(a.deadline) ?? 99999;
        const db = daysUntil(b.deadline) ?? 99999;
        return da - db;
      }
      if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [competitions, query, category, region, format, deadline, sort, forYou, savedIds, userInterests, historyCategories]);

  async function toggleSave(comp: Competition, e?: React.MouseEvent) {
    e?.stopPropagation();
    if (!loggedIn) {
      toast.error("Log in to save competitions", {
        action: { label: "Log in", onClick: () => (window.location.href = "/login") },
      });
      return;
    }
    const supabase = getSupabaseBrowser();
    if (!supabase) { toast.error("Supabase not configured."); return; }
    setSavingId(comp.id);
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) { setSavingId(null); toast.error("Please log in again."); return; }
    const already = savedIds.has(comp.id);
    if (already) {
      const { error } = await supabase.from("participation").delete().eq("user_id", uid).eq("competition_id", comp.id);
      if (error) { toast.error("Failed to remove."); setSavingId(null); return; }
      setSavedIds((s) => { const n = new Set(s); n.delete(comp.id); return n; });
      toast.success("Removed from tracker");
    } else {
      const { error } = await supabase.from("participation").insert({ user_id: uid, competition_id: comp.id, status: "interested" });
      if (error) { toast.error("Failed to save."); setSavingId(null); return; }
      await supabase.from("analytics_events").insert({ event_type: "competition_saved", user_id: uid, reference_id: comp.id });
      setSavedIds((s) => new Set(s).add(comp.id));
      toast.success("Saved to your tracker");
    }
    setSavingId(null);
  }

  function share(comp: Competition) {
    const url = `${window.location.origin}/competitions?c=${comp.id}`;
    if (navigator.share) navigator.share({ title: comp.title, url }).catch(() => {});
    else { navigator.clipboard.writeText(url); toast.success("Link copied"); }
  }

  return (
    <div>
      {/* filter bar */}
      <div className="sticky top-[84px] z-30 -mx-2 mb-6 rounded-xl border border-ink/10 bg-panel/95 p-3 shadow-hard-card backdrop-blur">
        <div className="flex flex-col gap-3">
          {loggedIn && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSort(forYou ? "deadline" : "foryou")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                  forYou
                    ? "border-transparent bg-ember text-white"
                    : "border-ink/15 text-ink-soft hover:border-ink/30"
                )}
              >
                <Sparkles className="h-4 w-4" /> For You
              </button>
              <button
                type="button"
                onClick={() => setInterestsOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink/30"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {userInterests.length ? "Edit interests" : "Pick your interests"}
              </button>
              {forYou && (
                <span className="text-xs text-ink-faint">
                  Ranked for you{userInterests.length ? "" : " — pick interests to improve this"}
                </span>
              )}
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
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
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
              {loggedIn && <option value="foryou">Sort: For You</option>}
              <option value="deadline">Sort: Deadline</option>
              <option value="newest">Sort: Newest</option>
              <option value="saved">Sort: Featured</option>
            </Select>
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-ink-faint">
        Showing <span className="font-semibold text-ink">{filtered.length}</span> competition
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
                interest={interestCounts[comp.id] ?? 0}
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
            {isAdmin && (
              <button
                onClick={() => setEditing(active)}
                aria-label="Edit competition"
                className="absolute left-4 top-4 z-10 rounded-md p-1.5 text-ink-faint transition-colors hover:bg-paper hover:text-ember"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <div className={cn("mb-3 flex flex-wrap items-center gap-2", isAdmin && "pl-9")}>
              {active.is_featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-ember px-2.5 py-0.5 text-xs font-semibold text-white">
                  <Star className="h-3 w-3" /> Featured
                </span>
              )}
              <CategoryBadge category={active.category} />
              <FormatBadge format={active.format} />
              <RegionBadge region={active.region} />
            </div>

            <h2 className="pr-6 font-heading text-2xl font-medium text-ink">{active.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-faint">
              {active.organizer && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" /> {active.organizer}
                </span>
              )}
              {(interestCounts[active.id] ?? 0) >= 3 && (
                <span className="flex items-center gap-1 font-semibold text-coral">
                  <Flame className="h-4 w-4" /> {interestCounts[active.id]} students interested
                </span>
              )}
            </div>

            <div className="mt-5 rounded-xl border border-ink/10 bg-paper p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Registration closes in
              </p>
              <Countdown deadline={active.deadline} />
              <p className="mt-2 text-xs text-ink-faint">
                Deadline: {formatDate(active.deadline)} · Event: {formatDate(active.event_date)}
              </p>
            </div>

            {active.description && (
              <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
                {active.description}
              </p>
            )}

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {active.eligibility && <Detail label="Eligibility" value={active.eligibility} />}
              {active.prize && (
                <Detail label="Prize" value={active.prize} icon={<Trophy className="h-4 w-4 text-ember" />} />
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              {active.registration_link && (
                <a
                  href={active.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "ember", className: "flex-1" })}
                >
                  Register now <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <Button
                variant={savedIds.has(active.id) ? "subtle" : "sketch"}
                onClick={(e) => toggleSave(active, e)}
              >
                {savedIds.has(active.id)
                  ? <><BookmarkCheck className="h-4 w-4" /> Saved</>
                  : <><Bookmark className="h-4 w-4" /> Save</>}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => share(active)} aria-label="Share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <TeammatesPanel competitionId={active.id} loggedIn={loggedIn} />
          </div>
        )}
      </Dialog>

      {isAdmin && (
        <CompetitionFormDialog
          open={!!editing}
          competition={editing}
          onClose={() => setEditing(null)}
          onSaved={(c) => {
            setCompetitions((list) => list.map((x) => (x.id === c.id ? c : x)));
            setActive((a) => (a && a.id === c.id ? c : a));
            setEditing(null);
          }}
        />
      )}

      {loggedIn && (
        <InterestsDialog
          open={interestsOpen}
          onClose={() => setInterestsOpen(false)}
          initialInterests={userInterests}
          onSaved={(next) => {
            setUserInterests(next);
            if (next.length) setSort("foryou");
          }}
        />
      )}
    </div>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-paper p-3">
      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {icon} {label}
      </dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}

function CompetitionCard({ comp, saved, saving, interest, onSave, onOpen }: {
  comp: Competition;
  saved: boolean;
  saving: boolean;
  interest: number;
  onSave: (e: React.MouseEvent) => void;
  onOpen: () => void;
}) {
  const urgency = deadlineUrgency(comp.deadline);
  return (
    <div
      onClick={onOpen}
      className={cn(
        "group flex h-full cursor-pointer flex-col rounded-[14px] border bg-panel p-5 shadow-hard-card transition-all hover:-translate-y-0.5 hover:shadow-hard-hover",
        comp.is_featured ? "border-coral/50 ring-1 ring-coral/15" : "border-ink/12"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {comp.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-ember px-2 py-0.5 text-[11px] font-semibold text-white">
              <Star className="h-3 w-3" /> Featured
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
            saved ? "bg-ember/10 text-ember" : "text-ink-faint hover:bg-paper hover:text-ember"
          )}
        >
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>

      <h3 className="font-heading text-[17px] font-medium leading-snug text-ink group-hover:text-ember">
        {comp.title}
      </h3>
      {comp.organizer && (
        <p className="mt-1 flex items-center gap-1 text-xs text-ink-faint">
          <Building2 className="h-3 w-3" /> {comp.organizer}
        </p>
      )}
      {comp.description && (
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-soft">{comp.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <FormatBadge format={comp.format} />
        <RegionBadge region={comp.region} />
        {interest >= 3 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-coral/10 px-2 py-0.5 text-[11px] font-semibold text-coral">
            <Flame className="h-3 w-3" /> {interest} interested
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-3">
        <span className={cn("flex items-center gap-1 text-sm font-medium", urgency.color)}>
          <CalendarClock className="h-4 w-4" /> {urgency.label}
        </span>
        <span className="text-xs font-medium text-ink-faint group-hover:text-ember transition-colors">View details →</span>
      </div>
    </div>
  );
}
