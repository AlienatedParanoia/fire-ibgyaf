"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, X, Flame, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CategoryBadge } from "@/components/competitions/badges";
import { SectionHeading } from "./users-section";
import { formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Competition, Club } from "@/lib/types";

type Kind = "competition" | "club";

export function ApprovalsSection({
  kind,
  competitions,
  clubs,
}: {
  kind: Kind;
  competitions?: Competition[];
  clubs?: Club[];
}) {
  const [comps, setComps] = React.useState((competitions ?? []).filter((c) => !c.is_approved));
  const [clubList, setClubList] = React.useState((clubs ?? []).filter((c) => !c.is_approved));
  const table = kind === "competition" ? "competitions" : "clubs";

  async function approve(id: string, featured = false) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    const patch =
      kind === "competition" ? { is_approved: true, is_featured: featured } : { is_approved: true };
    const { error } = await supabase.from(table).update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    if (kind === "competition") setComps((l) => l.filter((c) => c.id !== id));
    else setClubList((l) => l.filter((c) => c.id !== id));
    toast.success(`Approved${featured ? " & featured" : ""} 🎉`);
  }

  async function reject(id: string) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    const note = window.prompt("Optional note for rejection (the item will be removed):") ?? undefined;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (kind === "competition") setComps((l) => l.filter((c) => c.id !== id));
    else setClubList((l) => l.filter((c) => c.id !== id));
    toast.success(note ? "Rejected with note" : "Rejected");
  }

  const items = kind === "competition" ? comps : clubList;
  const title = kind === "competition" ? "Competition Approvals" : "Club Approvals";

  return (
    <div>
      <SectionHeading title={title} subtitle={`${items.length} awaiting review`} />
      {items.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-7 w-7" />}
          title="All caught up"
          description={`No ${kind}s are pending approval right now.`}
        />
      ) : (
        <div className="space-y-3">
          {kind === "competition"
            ? comps.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-3 rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-charcoal">{c.title}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <CategoryBadge category={c.category} />
                      {c.organizer} · Deadline {formatDate(c.deadline)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="accent" onClick={() => approve(c.id, true)}>
                      <Flame className="h-4 w-4" /> Approve + Feature
                    </Button>
                    <Button size="sm" onClick={() => approve(c.id, false)}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => reject(c.id)}>
                      <X className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))
            : clubList.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-3 rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-charcoal">{c.name}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <CategoryBadge category={c.category} />
                      {c.contact_person}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" onClick={() => approve(c.id)}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => reject(c.id)}>
                      <X className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}
