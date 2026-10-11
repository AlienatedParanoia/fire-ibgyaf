"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Label } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { CLUB_ROLE_LABELS, CLUB_ROLE_ORDER, groupTeam } from "@/lib/club-roles";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { ClubRole, ClubRoleType } from "@/lib/types";

/** Add / remove the people listed on a club's team (club leader of that club, or an admin). */
export function ClubTeamManager({ clubId }: { clubId: string }) {
  const [team, setTeam] = React.useState<ClubRole[] | null>(null);
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState<ClubRoleType>("officer");
  const [title, setTitle] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return setTeam([]);
    const { data, error } = await supabase.from("club_roles").select("*").eq("club_id", clubId);
    if (error) toast.error(error.message);
    setTeam((data ?? []) as ClubRole[]);
  }, [clubId]);

  React.useEffect(() => {
    setTeam(null);
    void load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Enter a name.");
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setBusy(true);
    const { data: auth } = await supabase.auth.getSession();
    const { error } = await supabase.from("club_roles").insert({
      club_id: clubId,
      display_name: name.trim(),
      role,
      title: title.trim() || null,
      assigned_by: auth.session?.user.id ?? null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setName("");
    setTitle("");
    await load();
  }

  async function remove(r: ClubRole) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setTeam((list) => (list ?? []).filter((x) => x.id !== r.id));
    const { data, error } = await supabase.from("club_roles").delete().eq("id", r.id).select("id");
    if (error || !data?.length) {
      toast.error(error?.message ?? "Could not remove this person.");
      await load();
    }
  }

  return (
    <div>
      <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_170px_1fr_auto] sm:items-end">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
        </div>
        <div>
          <Label>Team</Label>
          <Select value={role} onChange={(e) => setRole(e.target.value as ClubRoleType)}>
            {CLUB_ROLE_ORDER.map((r) => (
              <option key={r} value={r}>{CLUB_ROLE_LABELS[r]}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Title (optional)</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="e.g. Treasurer" />
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
        </Button>
      </form>

      <div className="mt-5">
        {team === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : team.length === 0 ? (
          <p className="text-sm text-muted-foreground">No team members listed yet.</p>
        ) : (
          groupTeam(team).map((g) => (
            <div key={g.role} className="mb-4">
              <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                {CLUB_ROLE_LABELS[g.role]}
              </p>
              <ul className="space-y-1.5">
                {g.people.map((p) => (
                  <li key={p.id} className="flex items-center justify-between rounded-lg border border-charcoal/10 px-3 py-2">
                    <span className="text-sm text-charcoal">
                      {p.display_name}
                      {p.title && <span className="ml-2 text-xs text-muted-foreground">{p.title}</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(p)}
                      aria-label={`Remove ${p.display_name}`}
                      className="rounded p-1 text-muted-foreground hover:bg-rose-50 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ClubTeamDialog({
  open,
  onClose,
  club,
}: {
  open: boolean;
  onClose: () => void;
  club: { id: string; name: string } | null;
}) {
  return (
    <Dialog open={open && !!club} onClose={onClose} title={club ? `Team — ${club.name}` : "Team"} className="max-w-2xl">
      {club && <ClubTeamManager clubId={club.id} />}
    </Dialog>
  );
}
