"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Download, Trash2, ListChecks, Loader2, StickyNote, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CATEGORIES, categoryColor, cn, formatDate, toCSV } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Participation, ParticipationStatus } from "@/lib/types";

const STATUSES: ParticipationStatus[] = ["interested", "registered", "participated", "won"];
const STATUS_STYLE: Record<ParticipationStatus, string> = {
  interested: "bg-charcoal/10 text-charcoal/70",
  registered: "bg-electric-50 text-electric-700",
  participated: "bg-amber-100 text-amber-700",
  won: "bg-emerald-100 text-emerald-700",
};
const STATUS_LABEL: Record<ParticipationStatus, string> = {
  interested: "Interested",
  registered: "Registered",
  participated: "Participated",
  won: "Won",
};

export function TrackerView({
  userId: _userId,
  initialParticipation,
}: {
  userId: string;
  initialParticipation: Participation[];
}) {
  const [participation, setParticipation] = React.useState(initialParticipation);
  const [noteFor, setNoteFor] = React.useState<Participation | null>(null);

  const supabase = getSupabaseBrowser();

  // ── stats ──────────────────────────────────────────────────────────────
  const statusCounts = React.useMemo(() => {
    const c: Record<ParticipationStatus, number> = {
      interested: 0,
      registered: 0,
      participated: 0,
      won: 0,
    };
    for (const p of participation) c[p.status] += 1;
    return c;
  }, [participation]);

  const categoryCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const p of participation) {
      const cat = p.competitions?.category || "Other";
      map.set(cat, (map.get(cat) ?? 0) + 1);
    }
    return CATEGORIES.map((c) => ({ category: c, count: map.get(c) ?? 0 })).filter((x) => x.count > 0);
  }, [participation]);

  async function cycleStatus(p: Participation) {
    if (!supabase) return toast.error("Supabase not configured.");
    const next = STATUSES[(STATUSES.indexOf(p.status) + 1) % STATUSES.length];
    setParticipation((list) => list.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
    const { error } = await supabase.from("participation").update({ status: next }).eq("id", p.id);
    if (error) toast.error(error.message);
    else toast.success(`Marked as ${next}`);
  }

  async function removeParticipation(p: Participation) {
    if (!supabase) return;
    const { error } = await supabase.from("participation").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    setParticipation((list) => list.filter((x) => x.id !== p.id));
    toast.success("Removed from tracker");
  }

  function exportCSV() {
    const rows = participation.map((p) => ({
      title: p.competitions?.title ?? "",
      organizer: p.competitions?.organizer ?? "",
      category: p.competitions?.category ?? "",
      status: p.status,
      deadline: p.competitions?.deadline ?? "",
      notes: p.notes ?? "",
    }));
    if (!rows.length) return toast.error("Nothing to export yet.");
    const blob = new Blob([toCSV(rows)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fire-tracker.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV");
  }

  const summary = [
    { label: "Total tracked", value: participation.length, accent: "text-fire" },
    { label: "Interested", value: statusCounts.interested, accent: "text-charcoal" },
    { label: "Registered", value: statusCounts.registered, accent: "text-electric" },
    { label: "Participated", value: statusCounts.participated, accent: "text-amber-600" },
    { label: "Won", value: statusCounts.won, accent: "text-emerald-600" },
  ];

  return (
    <div>
      {/* stats band */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {summary.map((s) => (
          <div key={s.label} className="rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm">
            <p className={cn("font-heading text-2xl font-bold", s.accent)}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* category breakdown */}
      {categoryCounts.length > 0 && (
        <div className="mb-6 rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            By category
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryCounts.map((c) => (
              <span
                key={c.category}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                  categoryColor(c.category)
                )}
              >
                {c.category}
                <span className="rounded-full bg-white/60 px-1.5 text-xs font-bold">{c.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {participation.length} competition{participation.length === 1 ? "" : "s"} tracked
        </p>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {participation.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="h-7 w-7" />}
          title="Your tracker is empty"
          description="Save competitions to track your progress through interested, registered, participated, and won."
          actionLabel="Browse competitions"
          actionHref="/competitions"
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-sm">
          <div className="scrollbar-thin overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-charcoal/10 bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Competition</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Deadline</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {participation.map((p) => (
                  <motion.tr key={p.id} layout className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{p.competitions?.title ?? "Competition"}</p>
                      <p className="text-xs text-muted-foreground">{p.competitions?.organizer}</p>
                      {p.notes && (
                        <p className="mt-0.5 text-xs italic text-muted-foreground">“{p.notes}”</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.competitions?.category ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(p.competitions?.deadline)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => cycleStatus(p)} title="Click to advance status">
                        <Badge className={cn("transition-colors", STATUS_STYLE[p.status])}>
                          {STATUS_LABEL[p.status]}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setNoteFor(p)} aria-label="Notes">
                          <StickyNote className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeParticipation(p)}
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Bookmark className="h-3.5 w-3.5" /> Tip: click a status badge to advance it
        (Interested → Registered → Participated → Won).
      </p>

      <NoteDialog
        participation={noteFor}
        onClose={() => setNoteFor(null)}
        onSaved={(id, notes) =>
          setParticipation((list) => list.map((x) => (x.id === id ? { ...x, notes } : x)))
        }
      />
    </div>
  );
}

function NoteDialog({
  participation,
  onClose,
  onSaved,
}: {
  participation: Participation | null;
  onClose: () => void;
  onSaved: (id: string, notes: string) => void;
}) {
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setNotes(participation?.notes ?? "");
  }, [participation]);

  async function save() {
    if (!participation) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("participation").update({ notes }).eq("id", participation.id);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    onSaved(participation.id, notes);
    toast.success("Note saved");
    onClose();
  }

  return (
    <Dialog open={!!participation} onClose={onClose} title="Add a note">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="e.g. Team formed, submitted abstract…"
        className="min-h-[120px]"
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={save} disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Save note
        </Button>
      </div>
    </Dialog>
  );
}
