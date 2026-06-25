"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Send, Bell } from "lucide-react";
import { Input, Select, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./users-section";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { AppUser } from "@/lib/types";

type Audience = "everyone" | "student" | "club_leader" | "admin" | "user";

/** Admin composer to send an in-app notification to a user, a role, or everyone. */
export function NotificationsSection({ users }: { users: AppUser[] }) {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [link, setLink] = React.useState("");
  const [audience, setAudience] = React.useState<Audience>("everyone");
  const [userId, setUserId] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const recipients = React.useMemo(() => {
    if (audience === "everyone") return users.map((u) => u.id);
    if (audience === "user") return userId ? [userId] : [];
    return users.filter((u) => u.role === audience).map((u) => u.id);
  }, [audience, userId, users]);

  async function send() {
    if (!title.trim()) return toast.error("Title is required.");
    if (recipients.length === 0) return toast.error("No recipients for this audience.");
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setSending(true);
    const payload = recipients.map((uid) => ({
      user_id: uid,
      type: "announcement",
      title: title.trim(),
      body: body.trim() || null,
      link: link.trim() || null,
    }));
    const { error } = await supabase.from("notifications").insert(payload);
    if (error) { toast.error(error.message); setSending(false); return; }
    toast.success(`Sent to ${recipients.length} ${recipients.length === 1 ? "person" : "people"}`);
    setTitle(""); setBody(""); setLink("");
    setSending(false);
  }

  return (
    <div>
      <SectionHeading title="Send Notification" subtitle="Push an in-app announcement to students" />

      <div className="max-w-2xl rounded-xl border border-ink/10 bg-panel p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New competitions just added!" />
          </div>
          <div className="sm:col-span-2">
            <Label>Message</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Optional details…" />
          </div>
          <div>
            <Label>Link (optional)</Label>
            <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="/competitions" />
          </div>
          <div>
            <Label>Audience</Label>
            <Select value={audience} onChange={(e) => setAudience(e.target.value as Audience)}>
              <option value="everyone">Everyone</option>
              <option value="student">Students</option>
              <option value="club_leader">Club leaders</option>
              <option value="admin">Admins</option>
              <option value="user">A specific user…</option>
            </Select>
          </div>
          {audience === "user" && (
            <div className="sm:col-span-2">
              <Label>User</Label>
              <Select value={userId} onChange={(e) => setUserId(e.target.value)}>
                <option value="">Select a user…</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.full_name || u.email}</option>)}
              </Select>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm text-ink-faint">
            <Bell className="h-4 w-4" /> {recipients.length} recipient{recipients.length === 1 ? "" : "s"}
          </p>
          <Button variant="ember" onClick={send} disabled={sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send
          </Button>
        </div>
      </div>
    </div>
  );
}
