"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Megaphone, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PriorityBadge } from "@/components/announcements/priority-badge";
import { cn, formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Announcement, AnnouncementPriority, Club, SubmissionStatus } from "@/lib/types";

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

/** Club leader: submit announcements for admin review and see how earlier ones fared. */
export function LeaderAnnouncements({
  userId,
  club,
  initial,
}: {
  userId: string;
  club: Club | null;
  initial: Announcement[];
}) {
  const [items, setItems] = React.useState(initial);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [priority, setPriority] = React.useState<AnnouncementPriority>("medium");
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  if (!club) {
    return (
      <EmptyState
        icon={<Megaphone className="h-7 w-7" />}
        title="Create your club first"
        description="Announcements are posted on behalf of your club."
      />
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return toast.error("Title and message are required.");
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setSaving(true);
    // status is pinned to 'pending' by the RLS check; only an admin can publish it.
    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title: title.trim(),
        content: content.trim(),
        priority,
        club_id: club!.id,
        author_id: userId,
        status: "pending",
      })
      .select()
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    setItems((list) => [data as Announcement, ...list]);
    setTitle("");
    setContent("");
    toast.success("Submitted — an admin will review it before it goes live");
  }

  async function remove(a: Announcement) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    if (deleting === a.id) return;
    setDeleting(a.id);
    const { data, error } = await supabase.from("announcements").delete().eq("id", a.id).select("id");
    setDeleting(null);
    if (error || !data?.length) return toast.error(error?.message ?? "Could not delete this announcement.");
    setItems((list) => list.filter((x) => x.id !== a.id));
  }

  return (
    <div className="max-w-2xl">
      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm"
      >
        <p className="text-sm text-muted-foreground">
          Posts are reviewed by an admin before they appear on the Announcements page.
        </p>
        <div>
          <Label>Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} />
        </div>
        <div>
          <Label>Message *</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={2000} />
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="w-40">
            <Label>Priority</Label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit for review
          </Button>
        </div>
      </form>

      <h3 className="mb-3 mt-8 font-heading text-lg font-semibold text-charcoal">Your announcements</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing submitted yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id} className="rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <PriorityBadge priority={a.priority} />
                <Badge className={cn("capitalize", STATUS_STYLE[a.status])}>{a.status}</Badge>
                <span className="ml-auto text-xs text-muted-foreground">{formatDate(a.created_at)}</span>
              </div>
              <p className="font-medium text-charcoal">{a.title}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{a.content}</p>
              {a.status === "pending" && (
                <Button
                  size="sm"
                  variant="sketch"
                  className="mt-3"
                  disabled={deleting === a.id}
                  onClick={() => remove(a)}
                >
                  <Trash2 className="h-4 w-4" /> Withdraw
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
