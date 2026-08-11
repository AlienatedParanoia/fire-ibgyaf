"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Send, StickyNote, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { AppUser, StudentNote, SubmissionStatus } from "@/lib/types";

const MAX_LEN = 280;

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export function NotesComposer({
  profile,
  initialNotes,
}: {
  profile: AppUser;
  initialNotes: StudentNote[];
}) {
  const [notes, setNotes] = React.useState(initialNotes);
  const [body, setBody] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      toast.error("Supabase not configured — add keys to .env.local.");
      return;
    }
    const trimmed = body.trim();
    if (!trimmed) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("student_notes")
      .insert({
        user_id: profile.id,
        author_name: profile.full_name?.trim() || profile.email.split("@")[0],
        author_school: profile.school,
        body: trimmed,
        status: "pending",
      })
      .select("*")
      .single();
    setLoading(false);
    if (error) {
      const rls = error.code === "42501" || /row-level security/i.test(error.message);
      toast.error(rls ? "Your note couldn't be submitted. Please sign in again and retry." : error.message);
      return;
    }
    setNotes((list) => [data as StudentNote, ...list]);
    setBody("");
    toast.success("Note sent for review!");
  }

  async function remove(n: StudentNote) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    if (deleting) return;
    if (!window.confirm("Delete this note?")) return;
    setDeleting(n.id);
    const { error } = await supabase.from("student_notes").delete().eq("id", n.id);
    setDeleting(null);
    if (error) return toast.error(error.message);
    setNotes((list) => list.filter((x) => x.id !== n.id));
    toast.success("Note deleted");
  }

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1 text-sm font-medium text-coral">
          <StickyNote className="h-4 w-4" /> Notes on the wall
        </div>
        <h1 className="font-heading text-3xl font-medium text-ink sm:text-4xl">
          Leave a Note<span className="text-coral">.</span>
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-ink-soft">
          Share a thought, a win, or a shout-out. Once our team approves it, your note appears on the
          F.I.R.E landing page with your name.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-ink/10 bg-panel p-6 shadow-hard-card sm:p-8"
      >
        <Label htmlFor="note-body">Your note *</Label>
        <Textarea
          id="note-body"
          required
          maxLength={MAX_LEN}
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind? Keep it short and sweet…"
          className="font-hand text-xl"
        />
        <div className="mt-2 flex items-center justify-between">
          <span
            className={cn(
              "text-xs",
              MAX_LEN - body.length <= 20 ? "font-semibold text-coral" : "text-muted-foreground"
            )}
          >
            {MAX_LEN - body.length} characters left
          </span>
          <Button type="submit" disabled={loading || !body.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? "Sending…" : "Send for review"}
          </Button>
        </div>
      </form>

      <div className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-semibold text-ink">Your notes</h2>
        {notes.length === 0 ? (
          <EmptyState
            icon={<StickyNote className="h-7 w-7" />}
            title="No notes yet"
            description="Write your first note above — approved notes go up on the landing page."
          />
        ) : (
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {notes.map((n) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="rounded-xl border border-ink/10 bg-panel p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-hand text-xl text-ink">{n.body}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge className={cn("capitalize", STATUS_STYLE[n.status])}>{n.status}</Badge>
                        <span>{formatDate(n.created_at)}</span>
                      </div>
                      {n.status === "rejected" && n.admin_notes && (
                        <p className="mt-1 text-xs italic text-rose-600">Note: {n.admin_notes}</p>
                      )}
                    </div>
                    {n.status === "pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(n)}
                        disabled={deleting === n.id}
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
