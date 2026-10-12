"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import type { Club } from "@/lib/types";

/** Emails an invitation to run a club. The recipient chooses to accept; nothing is created for them silently. */
export function InviteLeaderDialog({
  open,
  club,
  onClose,
  onInvited,
}: {
  open: boolean;
  club: Club | null;
  onClose: () => void;
  onInvited: (clubId: string) => void;
}) {
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (open) setEmail(club?.contact_email ?? "");
  }, [open, club]);

  async function send() {
    if (!club) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/invite-leader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId: club.id, email }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) return void toast.error(body.error ?? "Could not send the invitation.");
      toast.success(`Invitation sent to ${email.trim()}`);
      onInvited(club.id);
      onClose();
    } catch {
      toast.error("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open && !!club} onClose={onClose} title={club ? `Invite a leader — ${club.name}` : "Invite a leader"}>
      <p className="mb-4 text-sm text-ink-soft">
        We&apos;ll email them a link to set up their account. They become the club leader once they accept, and
        can ignore the email if it isn&apos;t for them.
      </p>
      <Label htmlFor="invite-email">Email address</Label>
      <Input
        id="invite-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="president@school.edu"
      />
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="sketch" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="ember" onClick={send} disabled={busy || !email.trim()}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send invitation
        </Button>
      </div>
    </Dialog>
  );
}
