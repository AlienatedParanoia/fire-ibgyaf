"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, X, StickyNote, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "./users-section";
import { cn, formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { StudentNote, SubmissionStatus } from "@/lib/types";

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export function NotesSection({
  notes: initial,
  onChanged,
}: {
  notes: StudentNote[];
  onChanged?: () => void;
}) {
  const [notes, setNotes] = React.useState(initial);
  const [filter, setFilter] = React.useState<SubmissionStatus | "">("pending");
  const [pending, setPending] = React.useState<string | null>(null);

  const filtered = filter ? notes.filter((n) => n.status === filter) : notes;

  async function approve(n: StudentNote) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    if (pending === n.id) return;
    setPending(n.id);
    const { error } = await supabase
      .from("student_notes")
      .update({ status: "approved" })
      .eq("id", n.id);
    setPending(null);
    if (error) return toast.error(error.message);
    setNotes((list) => list.map((x) => (x.id === n.id ? { ...x, status: "approved" } : x)));
    toast.success("Approved — the note is on the wall 🎉");
    onChanged?.();
  }

  async function reject(n: StudentNote) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    if (pending === n.id) return;
    const note = window.prompt("Reason for rejection (optional):");
    if (note === null) return;
    const adminNotes = note.trim() || null;
    setPending(n.id);
    const { error } = await supabase
      .from("student_notes")
      .update({ status: "rejected", admin_notes: adminNotes })
      .eq("id", n.id);
    setPending(null);
    if (error) return toast.error(error.message);
    setNotes((list) =>
      list.map((x) => (x.id === n.id ? { ...x, status: "rejected", admin_notes: adminNotes } : x))
    );
    toast.success("Note rejected");
    onChanged?.();
  }

  async function remove(n: StudentNote) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    if (pending === n.id) return;
    if (!window.confirm("Delete this note permanently?")) return;
    setPending(n.id);
    const { error } = await supabase.from("student_notes").delete().eq("id", n.id);
    setPending(null);
    if (error) return toast.error(error.message);
    setNotes((list) => list.filter((x) => x.id !== n.id));
    toast.success("Note deleted");
    onChanged?.();
  }

  return (
    <div>
      <SectionHeading
        title="Student Notes"
        subtitle="Approve notes to feature them on the landing-page wall"
      />
      <div className="mb-4 flex items-center gap-3">
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as SubmissionStatus | "")}
          className="w-48"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} shown</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<StickyNote className="h-7 w-7" />}
          title="Nothing here"
          description="No notes match this filter."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div key={n.id} className="rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-hand text-xl text-charcoal">{n.body}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <Badge className={cn("capitalize", STATUS_STYLE[n.status])}>{n.status}</Badge>
                    <span>
                      {n.author_name}
                      {n.author_school ? ` · ${n.author_school}` : ""}
                    </span>
                    <span>{formatDate(n.created_at)}</span>
                  </p>
                  {n.admin_notes && (
                    <p className="mt-1 text-xs italic text-rose-600">Note: {n.admin_notes}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  {n.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => approve(n)} disabled={pending === n.id}>
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reject(n)}
                        disabled={pending === n.id}
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  )}
                  {n.status !== "pending" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(n)}
                      disabled={pending === n.id}
                      aria-label="Delete note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
