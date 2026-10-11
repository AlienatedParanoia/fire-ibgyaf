"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Crown, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, Textarea, Label } from "@/components/ui/input";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { RoleRequest } from "@/lib/types";

/** Dashboard card letting a student ask to become a club leader (admin approves). */
export function RequestLeaderCard({
  userId,
  latest,
  clubs,
}: {
  userId: string;
  latest: RoleRequest | null;
  clubs: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [clubId, setClubId] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const pending = latest?.status === "pending";
  const declined = latest?.status === "rejected";

  async function submit() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setBusy(true);
    const { error } = await supabase.from("role_requests").insert({
      user_id: userId,
      requested_role: "club_leader",
      club_id: clubId || null,
      message: message.trim() || null,
    });
    setBusy(false);
    if (error) {
      return toast.error(
        error.code === "23505" ? "You already have a request waiting for review." : error.message
      );
    }
    toast.success("Request sent — an admin will review it");
    setOpen(false);
    router.refresh();
  }

  async function withdraw() {
    if (!latest) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.from("role_requests").delete().eq("id", latest.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    router.refresh();
  }

  return (
    <section className="mb-6 rounded-xl border border-charcoal/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            {pending ? <Clock className="h-5 w-5" /> : <Crown className="h-5 w-5" />}
          </span>
          <div>
            <h2 className="font-heading text-base font-semibold text-charcoal">
              {pending ? "Your club leader request is under review" : "Run a club?"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {pending
                ? "An admin will approve it soon — you'll get a notification."
                : declined
                  ? "Your last request was declined. You can send a new one with more detail."
                  : "Request club leader access to manage your club, post announcements and list competitions."}
            </p>
          </div>
        </div>
        {pending ? (
          <Button size="sm" variant="sketch" onClick={withdraw} disabled={busy}>
            Withdraw
          </Button>
        ) : (
          <Button size="sm" onClick={() => setOpen((v) => !v)}>
            Request access
          </Button>
        )}
      </div>

      {open && !pending && (
        <div className="mt-4 grid gap-4 border-t border-charcoal/10 pt-4 sm:grid-cols-2">
          <div>
            <Label>Which club do you lead?</Label>
            <Select value={clubId} onChange={(e) => setClubId(e.target.value)}>
              <option value="">Not listed / new club</option>
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Anything the admin should know?</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              placeholder="e.g. I'm the president of the club and my teacher advisor is…"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button onClick={submit} disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Send request
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
