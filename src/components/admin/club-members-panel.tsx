"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, UserPlus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { initials } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { AppUser, Club } from "@/lib/types";

type MemberRow = {
  id: string;
  user_id: string;
  status: string;
  users: { full_name: string | null; email: string; school: string | null } | null;
};

/** Admin dialog to add/remove members of a club. member_count is kept in sync
 *  by the participation trigger (migration-admin.sql, PR 2). */
export function ClubMembersDialog({
  open,
  onClose,
  club,
  users,
}: {
  open: boolean;
  onClose: () => void;
  club: Club | null;
  users: AppUser[];
}) {
  const [members, setMembers] = React.useState<MemberRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [pick, setPick] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!club) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("participation")
      .select("id, user_id, status, users(full_name, email, school)")
      .eq("club_id", club.id)
      .order("created_at", { ascending: true });
    setMembers((data ?? []) as unknown as MemberRow[]);
    setLoading(false);
  }, [club]);

  React.useEffect(() => { if (open) { setPick(""); load(); } }, [open, load]);

  if (!club) return null;

  const memberIds = new Set(members.map((m) => m.user_id));
  const addable = users.filter((u) => !memberIds.has(u.id));

  async function add() {
    if (!pick || !club) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase
      .from("participation")
      .insert({ user_id: pick, club_id: club.id, status: "registered" });
    if (error) { toast.error(error.message); setBusy(false); return; }
    setPick("");
    await load();
    setBusy(false);
    toast.success("Member added");
  }

  async function remove(row: MemberRow) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setMembers((l) => l.filter((m) => m.id !== row.id));
    const { error } = await supabase.from("participation").delete().eq("id", row.id);
    if (error) { toast.error(error.message); load(); return; }
    toast.success("Member removed");
  }

  return (
    <Dialog open={open} onClose={onClose} title={`Members — ${club.name}`} className="max-w-lg">
      <div className="mb-4 flex gap-2">
        <Select value={pick} onChange={(e) => setPick(e.target.value)} className="flex-1">
          <option value="">Add a member…</option>
          {addable.map((u) => (
            <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
          ))}
        </Select>
        <Button variant="ember" onClick={add} disabled={busy || !pick}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Add
        </Button>
      </div>

      {loading ? (
        <p className="flex items-center gap-2 py-6 text-sm text-ink-faint">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading members…
        </p>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center text-sm text-ink-faint">
          <Users className="mb-2 h-7 w-7 opacity-40" /> No members yet.
        </div>
      ) : (
        <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto scrollbar-thin">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-ink/10 bg-paper px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember text-xs font-bold text-white">
                  {initials(m.users?.full_name || m.users?.email || "?")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{m.users?.full_name || "—"}</p>
                  <p className="truncate text-xs text-ink-faint">
                    {m.users?.email}{m.users?.school ? ` · ${m.users.school}` : ""}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(m)} aria-label="Remove member">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-ink-faint">{members.length} member{members.length === 1 ? "" : "s"}</p>
    </Dialog>
  );
}
