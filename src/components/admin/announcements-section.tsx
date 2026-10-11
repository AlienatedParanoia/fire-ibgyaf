"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, X, Trash2, Megaphone, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea, Label } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { PriorityBadge } from "@/components/announcements/priority-badge";
import { SectionHeading } from "./users-section";
import { cn, formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Announcement, AnnouncementPriority, Club, SubmissionStatus } from "@/lib/types";

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

/** Admin: publish announcements and review ones submitted by club leaders. */
export function AnnouncementsSection({
  announcements: initial,
  clubs,
  userId,
  onChanged,
}: {
  announcements: Announcement[];
  clubs: Club[];
  userId: string;
  onChanged?: () => void;
}) {
  const [items, setItems] = React.useState(initial);
  const [filter, setFilter] = React.useState<SubmissionStatus | "">("pending");
  const [busy, setBusy] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [priority, setPriority] = React.useState<AnnouncementPriority>("medium");
  const [clubId, setClubId] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const clubName = (id: string | null) => clubs.find((c) => c.id === id)?.name;
  const filtered = filter ? items.filter((a) => a.status === filter) : items;

  async function publish() {
    if (!title.trim() || !content.trim()) return toast.error("Title and message are required.");
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setSaving(true);
    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title: title.trim(),
        content: content.trim(),
        priority,
        club_id: clubId || null,
        author_id: userId,
        status: "approved",
      })
      .select()
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    setItems((list) => [data as Announcement, ...list]);
    setTitle("");
    setContent("");
    setClubId("");
    toast.success("Announcement published");
    onChanged?.();
  }

  async function setStatus(a: Announcement, status: SubmissionStatus) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    if (busy === a.id) return;
    setBusy(a.id);
    const { error } = await supabase.from("announcements").update({ status }).eq("id", a.id);
    setBusy(null);
    if (error) return toast.error(error.message);
    setItems((list) => list.map((x) => (x.id === a.id ? { ...x, status } : x)));
    toast.success(status === "approved" ? "Approved — it's live" : "Rejected");
    onChanged?.();
  }

  async function remove(a: Announcement) {
    if (!window.confirm(`Delete "${a.title}"?`)) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    if (busy === a.id) return;
    setBusy(a.id);
    const { error } = await supabase.from("announcements").delete().eq("id", a.id);
    setBusy(null);
    if (error) return toast.error(error.message);
    setItems((list) => list.filter((x) => x.id !== a.id));
    toast.success("Deleted");
    onChanged?.();
  }

  return (
    <div>
      <SectionHeading title="Announcements" subtitle="Publish news and review posts from club leaders" />

      <div className="mb-6 rounded-xl border border-ink/10 bg-panel p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} />
          </div>
          <div className="sm:col-span-2">
            <Label>Message *</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={2000} />
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
          <div>
            <Label>Club (optional)</Label>
            <Select value={clubId} onChange={(e) => setClubId(e.target.value)}>
              <option value="">F.I.R.E (platform-wide)</option>
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button variant="ember" onClick={publish} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Publish
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Select value={filter} onChange={(e) => setFilter(e.target.value as SubmissionStatus | "")} className="max-w-[200px]">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
        <span className="text-sm text-ink-faint">{filtered.length} shown</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Megaphone className="h-7 w-7" />} title="No announcements here" />
      ) : (
        <ul className="space-y-3">
          {filtered.map((a) => (
            <li key={a.id} className="rounded-xl border border-ink/10 bg-panel p-4 shadow-sm">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <PriorityBadge priority={a.priority} />
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase", STATUS_STYLE[a.status])}>
                  {a.status}
                </span>
                {clubName(a.club_id) && <span className="text-xs text-ink-faint">{clubName(a.club_id)}</span>}
                <span className="ml-auto text-xs text-ink-faint">{formatDate(a.created_at)}</span>
              </div>
              <p className="font-heading text-lg font-medium text-ink">{a.title}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-soft">{a.content}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {a.status !== "approved" && (
                  <Button size="sm" variant="ember" disabled={busy === a.id} onClick={() => setStatus(a, "approved")}>
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                )}
                {a.status !== "rejected" && (
                  <Button size="sm" variant="sketch" disabled={busy === a.id} onClick={() => setStatus(a, "rejected")}>
                    <X className="h-4 w-4" /> Reject
                  </Button>
                )}
                <Button size="sm" variant="sketch" disabled={busy === a.id} onClick={() => remove(a)}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
