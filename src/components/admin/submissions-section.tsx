"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, X, Inbox, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CategoryBadge } from "@/components/competitions/badges";
import { SectionHeading } from "./users-section";
import { cn, formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { CommunitySubmission, SubmissionStatus } from "@/lib/types";

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export function SubmissionsSection({ submissions: initial }: { submissions: CommunitySubmission[] }) {
  const [subs, setSubs] = React.useState(initial);
  const [filter, setFilter] = React.useState<SubmissionStatus | "">("pending");

  const filtered = filter ? subs.filter((s) => s.status === filter) : subs;

  async function approve(s: CommunitySubmission) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");

    // 1. create the real record
    let err = null;
    if (s.type === "competition") {
      const { error } = await supabase.from("competitions").insert({
        title: s.title,
        description: s.description,
        category: s.category,
        organizer: s.organizer,
        deadline: s.deadline,
        eligibility: s.eligibility,
        registration_link: s.registration_link,
        region: "Singapore",
        format: "online",
        is_approved: true,
      });
      err = error;
    } else {
      const { error } = await supabase.from("clubs").insert({
        name: s.title,
        description: s.description,
        category: s.category,
        contact_email: s.submitted_by_email,
        contact_person: s.submitted_by_name,
        is_approved: true,
      });
      err = error;
    }
    if (err) return toast.error(err.message);

    // 2. mark the submission approved
    await supabase.from("community_submissions").update({ status: "approved" }).eq("id", s.id);
    setSubs((list) => list.map((x) => (x.id === s.id ? { ...x, status: "approved" } : x)));
    toast.success(`Approved — ${s.type} is now live 🎉`);
  }

  async function reject(s: CommunitySubmission) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    const note = window.prompt("Reason for rejection (optional):") ?? null;
    await supabase
      .from("community_submissions")
      .update({ status: "rejected", admin_notes: note })
      .eq("id", s.id);
    setSubs((list) =>
      list.map((x) => (x.id === s.id ? { ...x, status: "rejected", admin_notes: note } : x))
    );
    toast.success("Submission rejected");
  }

  return (
    <div>
      <SectionHeading
        title="Community Submissions"
        subtitle="Review opportunities suggested by the community"
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
        <EmptyState icon={<Inbox className="h-7 w-7" />} title="Nothing here" description="No submissions match this filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge className="bg-charcoal/10 capitalize text-charcoal/70">{s.type}</Badge>
                    <CategoryBadge category={s.category} />
                    <Badge className={cn("capitalize", STATUS_STYLE[s.status])}>{s.status}</Badge>
                  </div>
                  <p className="font-medium text-charcoal">{s.title}</p>
                  {s.description && (
                    <p className="mt-0.5 text-sm text-muted-foreground">{s.description}</p>
                  )}
                  <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {s.submitted_by_name} · {s.submitted_by_email}
                    </span>
                    {s.deadline && <span>Deadline {formatDate(s.deadline)}</span>}
                    {s.registration_link && (
                      <a
                        href={s.registration_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-electric hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> Link
                      </a>
                    )}
                  </p>
                  {s.admin_notes && (
                    <p className="mt-1 text-xs italic text-rose-600">Note: {s.admin_notes}</p>
                  )}
                </div>
                {s.status === "pending" && (
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" onClick={() => approve(s)}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => reject(s)}>
                      <X className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
