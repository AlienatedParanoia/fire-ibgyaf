"use client";

import * as React from "react";
import { toast } from "sonner";
import { Search, Trash2, Loader2 } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./users-section";
import { formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { AppUser, Club, Competition, Participation, ParticipationStatus } from "@/lib/types";

const STATUSES: ParticipationStatus[] = ["interested", "registered", "participated", "won"];

export function ParticipationSection({
  participation: initial,
  users,
  competitions,
  clubs,
}: {
  participation: Participation[];
  users: AppUser[];
  competitions: Competition[];
  clubs: Club[];
}) {
  const [rows, setRows] = React.useState(initial);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [type, setType] = React.useState("");
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const userName = React.useCallback(
    (id: string) => users.find((u) => u.id === id)?.full_name || users.find((u) => u.id === id)?.email || "Unknown",
    [users]
  );
  const targetLabel = React.useCallback(
    (p: Participation) => {
      if (p.competition_id) return competitions.find((c) => c.id === p.competition_id)?.title ?? "competition";
      if (p.club_id) return clubs.find((c) => c.id === p.club_id)?.name ?? "club";
      return "—";
    },
    [competitions, clubs]
  );

  const filtered = rows.filter((p) => {
    if (status && p.status !== status) return false;
    if (type === "competition" && !p.competition_id) return false;
    if (type === "club" && !p.club_id) return false;
    if (q) {
      const hay = `${userName(p.user_id)} ${targetLabel(p)}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  async function changeStatus(p: Participation, next: ParticipationStatus) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setRows((l) => l.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
    const { error } = await supabase.from("participation").update({ status: next }).eq("id", p.id);
    if (error) {
      toast.error(error.message);
      setRows((l) => l.map((x) => (x.id === p.id ? { ...x, status: p.status } : x)));
    } else toast.success("Status updated");
  }

  async function remove(p: Participation) {
    if (!confirm("Delete this participation record?")) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setDeleting(p.id);
    const { error } = await supabase.from("participation").delete().eq("id", p.id);
    if (error) { toast.error(error.message); setDeleting(null); return; }
    setRows((l) => l.filter((x) => x.id !== p.id));
    toast.success("Deleted");
    setDeleting(null);
  }

  return (
    <div>
      <SectionHeading title="Participation" subtitle={`${rows.length} records across competitions & clubs`} />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <Input placeholder="Search by student or item…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={type} onChange={(e) => setType(e.target.value)} className="sm:w-40">
          <option value="">All types</option>
          <option value="competition">Competitions</option>
          <option value="club">Clubs</option>
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-44">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink/10 bg-panel shadow-sm">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-paper text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-ink">{userName(p.user_id)}</td>
                  <td className="px-4 py-3 text-ink-soft">{targetLabel(p)}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.competition_id ? "Competition" : p.club_id ? "Club" : "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={p.status}
                      onChange={(e) => changeStatus(p, e.target.value as ParticipationStatus)}
                      className="h-8 w-36 text-xs capitalize"
                    >
                      {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" onClick={() => remove(p)} disabled={deleting === p.id} aria-label="Delete">
                        {deleting === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-faint">No participation records match.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
