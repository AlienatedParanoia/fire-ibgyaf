"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "./users-section";
import { formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { AppUser, Club, RoleRequest } from "@/lib/types";

/** Admin queue for "I'd like to lead a club" requests. */
export function RoleRequestsSection({
  requests: initial,
  users,
  clubs,
  onChanged,
}: {
  requests: RoleRequest[];
  users: AppUser[];
  clubs: Club[];
  onChanged?: () => void;
}) {
  const [requests, setRequests] = React.useState(initial.filter((r) => r.status === "pending"));
  const [busy, setBusy] = React.useState<string | null>(null);

  async function review(r: RoleRequest, approve: boolean) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    if (busy === r.id) return;
    setBusy(r.id);
    // One atomic call: request status, role change, club assignment, notification, audit entry.
    const { error } = await supabase.rpc("review_role_request", { p_id: r.id, p_approve: approve });
    setBusy(null);
    if (error) return toast.error(error.message);
    setRequests((list) => list.filter((x) => x.id !== r.id));
    toast.success(approve ? "Approved — they're now a club leader" : "Request declined");
    onChanged?.();
  }

  return (
    <div>
      <SectionHeading title="Role Requests" subtitle={`${requests.length} pending`} />
      {requests.length === 0 ? (
        <EmptyState icon={<Crown className="h-7 w-7" />} title="No pending requests" />
      ) : (
        <ul className="space-y-3">
          {requests.map((r) => {
            const u = users.find((x) => x.id === r.user_id);
            const club = clubs.find((c) => c.id === r.club_id);
            const taken = !!club?.leader_id && club.leader_id !== r.user_id;
            return (
              <li key={r.id} className="rounded-xl border border-ink/10 bg-panel p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{u?.full_name || u?.email || "Unknown user"}</p>
                    <p className="text-xs text-ink-faint">
                      {u?.email} · {u?.school || "no school"} {u?.grade ? `· ${u.grade}` : ""} · {formatDate(r.created_at)}
                    </p>
                    <p className="mt-2 text-sm text-ink-soft">
                      Wants to lead{" "}
                      <b className="text-ink">{club ? club.name : "a club (none chosen)"}</b>
                      {taken && <span className="text-rose-600"> — that club already has a leader</span>}
                    </p>
                    {r.message && (
                      <p className="mt-2 whitespace-pre-line rounded-lg bg-paper p-3 text-sm text-ink-soft">{r.message}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="sketch" disabled={busy === r.id} onClick={() => review(r, false)}>
                      <X className="h-4 w-4" /> Decline
                    </Button>
                    <Button size="sm" variant="ember" disabled={busy === r.id} onClick={() => review(r, true)}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
