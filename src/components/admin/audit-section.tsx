"use client";

import * as React from "react";
import { ScrollText } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "./users-section";
import type { AppUser, AuditEntry } from "@/lib/types";

/** Read-only history of admin actions, newest first. */
export function AuditSection({ entries, users }: { entries: AuditEntry[]; users: AppUser[] }) {
  const [q, setQ] = React.useState("");
  const [kind, setKind] = React.useState("");

  const nameOf = React.useMemo(() => {
    const m = new Map(users.map((u) => [u.id, u.full_name || u.email]));
    return (id: string | null) => (id ? m.get(id) ?? "Deleted user" : "System");
  }, [users]);

  const kinds = React.useMemo(
    () => Array.from(new Set(entries.map((e) => e.action.split(".")[0]))).sort(),
    [entries]
  );

  const filtered = entries.filter((e) => {
    if (kind && e.action.split(".")[0] !== kind) return false;
    if (!q.trim()) return true;
    const hay = `${e.action} ${nameOf(e.actor_id)} ${e.target_id ?? ""} ${JSON.stringify(e.details)}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  return (
    <div>
      <SectionHeading title="Audit Log" subtitle={`Latest ${entries.length} admin actions`} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Search action, admin, target…" value={q} onChange={(e) => setQ(e.target.value)} className="flex-1" />
        <Select value={kind} onChange={(e) => setKind(e.target.value)} className="sm:w-48">
          <option value="">All types</option>
          {kinds.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ScrollText className="h-7 w-7" />} title="No matching entries" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-ink/10 bg-panel shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink/10 bg-paper text-xs uppercase tracking-wide text-ink-faint">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.map((e) => (
                  <tr key={e.id} className="align-top hover:bg-paper/60">
                    <td className="whitespace-nowrap px-4 py-3 text-ink-faint">
                      {new Date(e.created_at).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink">{nameOf(e.actor_id)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink">{e.action}</td>
                    <td className="px-4 py-3 text-ink-soft">
                      <span className="break-all text-xs">
                        {Object.entries(e.details ?? {})
                          .filter(([, v]) => v !== null && v !== "")
                          .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
                          .join(" · ") || (e.target_id ?? "—")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
