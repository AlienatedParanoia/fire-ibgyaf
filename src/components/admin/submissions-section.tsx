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
import { cn, formatDate, safeHttpUrl } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { CommunitySubmission, SubmissionStatus } from "@/lib/types";

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export function SubmissionsSection({
  submissions: initial,
  onChanged,
}: {
  submissions: CommunitySubmission[];
  onChanged?: () => void;
}) {
  const [subs, setSubs] = React.useState(initial);
  const [filter, setFilter] = React.useState<SubmissionStatus | "">("pending");
  const [pending, setPending] = React.useState<string | null>(null);

  const filtered = filter ? subs.filter((s) => s.status === filter) : subs;

  async function approve(s: CommunitySubmission) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    if (pending === s.id) return;
    setPending(s.id);

    // 1. create the real record
    const table = s.type === "competition" ? "competitions" : "clubs";
    let createdId: string | null = null;
    let err = null;
    if (s.type === "competition") {
      const { data, error } = await supabase
        .from("competitions")
        .insert({
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
        })
        .select("id")
        .single();
      createdId = data?.id ?? null;
      err = error;
    } else {
      const { data, error } = await supabase
        .from("clubs")
        .insert({
          name: s.title,
          description: s.description,
          category: s.category,
          contact_email: s.submitted_by_email,
          contact_person: s.submitted_by_name,
          is_approved: true,
        })
        .select("id")
        .single();
      createdId = data?.id ?? null;
      err = error;
    }
    if (err) { setPending(null); return toast.error(err.message); }

    // 2. mark the submission approved — if that fails the new record has to go
    // back, otherwise approving again would publish a second copy.
    const { error: statusErr } = await supabase
      .from("community_submissions")
      .update({ status: "approved" })
      .eq("id", s.id);
    if (statusErr) {
      const undo = createdId ? await supabase.from(table).delete().eq("id", createdId) : null;
      setPending(null);
      return toast.error(
        undo?.error
          ? `${statusErr.message} — the new ${s.type} is live, remove it by hand before retrying.`
          : statusErr.message
      );
    }

    setSubs((list) => list.map((x) => (x.id === s.id ? { ...x, status: "approved" } : x)));
    toast.success(`Approved — ${s.type} is now live 🎉`);
    setPending(null);
    onChanged?.();
  }

  async function reject(s: CommunitySubmission) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    if (pending === s.id) return;
    const note = window.prompt("Reason for rejection (optional):");
    if (note === null) return;
    const notes = note.trim() || null;
    setPending(s.id);
    const { error } = await supabase
      .from("community_submissions")
      .update({ status: "rejected", admin_notes: notes })
      .eq("id", s.id);
    if (error) { setPending(null); return toast.error(error.message); }
    setSubs((list) =>
      list.map((x) => (x.id === s.id ? { ...x, status: "rejected", admin_notes: notes } : x))
    );
    toast.success("Submission rejected");
    setPending(null);
    onChanged?.();
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
                    {s.registration_link && <SubmittedLink url={s.registration_link} />}
                  </p>
                  {s.admin_notes && (
                    <p className="mt-1 text-xs italic text-rose-600">Note: {s.admin_notes}</p>
                  )}
                </div>
                {s.status === "pending" && (
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" onClick={() => approve(s)} disabled={pending === s.id}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reject(s)}
                      disabled={pending === s.id}
                    >
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

/**
 * The link comes straight from the submission form, so a `javascript:` URL would
 * run in the admin's own session on click. Anything that is not http(s) is shown
 * as plain text — the admin still has to read it to judge the submission.
 */
function SubmittedLink({ url }: { url: string }) {
  const safe = safeHttpUrl(url);
  if (!safe) {
    return (
      <span className="flex items-center gap-1 break-all text-muted-foreground">
        <ExternalLink className="h-3 w-3 shrink-0" /> {url}
      </span>
    );
  }
  return (
    <a
      href={safe}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1 text-electric hover:underline"
    >
      <ExternalLink className="h-3 w-3" /> Link
    </a>
  );
}
