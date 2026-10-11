"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

/** Self-service account deletion. The user must retype their email to confirm. */
export function DeleteAccountCard({ email }: { email: string }) {
  const [open, setOpen] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function remove() {
    setBusy(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: typed.trim() }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(body.error ?? "Could not delete your account.");
        setBusy(false);
        return;
      }
      toast.success("Your account has been deleted.");
      // Full navigation so the server clears the (now dead) session cookies.
      window.location.assign("/auth/signout");
    } catch {
      toast.error("Could not reach the server.");
      setBusy(false);
    }
  }

  const matches = typed.trim().toLowerCase() === email.toLowerCase();

  return (
    <section className="mt-10 rounded-xl border border-rose-200 bg-rose-50/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-base font-semibold text-charcoal">Delete account</h2>
          <p className="text-sm text-muted-foreground">
            Permanently removes your profile, saved competitions, portfolio and club memberships. This can&apos;t be undone.
          </p>
        </div>
        {!open && (
          <Button size="sm" variant="sketch" onClick={() => setOpen(true)}>
            <Trash2 className="h-4 w-4 text-destructive" /> Delete my account
          </Button>
        )}
      </div>
      {open && (
        <div className="mt-4 max-w-md">
          <Label htmlFor="del-email">Type your email ({email}) to confirm</Label>
          <Input id="del-email" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="sketch" onClick={() => { setOpen(false); setTyped(""); }} disabled={busy}>
              Cancel
            </Button>
            <Button size="sm" onClick={remove} disabled={!matches || busy} className="bg-destructive text-white hover:bg-destructive/90">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Permanently delete
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
