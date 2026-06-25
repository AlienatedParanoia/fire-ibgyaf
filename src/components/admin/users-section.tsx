"use client";

import * as React from "react";
import { toast } from "sonner";
import { Search, Trash2, Loader2, Pencil } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserEditDialog } from "./user-edit-dialog";
import { cn, formatDate, initials } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { AppUser, UserRole } from "@/lib/types";

const ROLE_STYLE: Record<UserRole, string> = {
  student:     "bg-ink/8 text-ink-soft",
  club_leader: "bg-pen/10 text-pen",
  admin:       "bg-ember/10 text-ember",
};

export function UsersSection({ users: initial }: { users: AppUser[] }) {
  const [users, setUsers] = React.useState(initial);
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState("");
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<AppUser | null>(null);

  const filtered = users.filter((u) => {
    if (role && u.role !== role) return false;
    if (q) {
      const hay = `${u.full_name ?? ""} ${u.email} ${u.school ?? ""}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  async function changeRole(user: AppUser, newRole: UserRole) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setUsers((l) => l.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", user.id);
    if (error) {
      toast.error(error.message);
      setUsers((l) => l.map((u) => (u.id === user.id ? { ...u, role: user.role } : u)));
    } else {
      toast.success(`${user.full_name || user.email} is now ${newRole.replace("_", " ")}`);
    }
  }

  async function deleteUser(user: AppUser) {
    if (!confirm(`Delete user "${user.full_name || user.email}"? This cannot be undone.`)) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setDeleting(user.id);
    const { error } = await supabase.from("users").delete().eq("id", user.id);
    if (error) { toast.error(error.message); setDeleting(null); return; }
    setUsers((l) => l.filter((u) => u.id !== user.id));
    toast.success("User removed");
    setDeleting(null);
  }

  return (
    <div>
      <SectionHeading title="User Management" subtitle={`${users.length} registered users`} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <Input
            placeholder="Search name, email, school…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={role} onChange={(e) => setRole(e.target.value)} className="sm:w-48">
          <option value="">All roles</option>
          <option value="student">Student</option>
          <option value="club_leader">Club Leader</option>
          <option value="admin">Admin</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink/10 bg-panel shadow-sm">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-paper text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">School</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember text-xs font-bold text-white">
                        {initials(u.full_name || u.email)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{u.full_name || "—"}</p>
                        <p className="truncate text-xs text-ink-faint">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{u.school ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{u.grade ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("capitalize", ROLE_STYLE[u.role])}>
                        {u.role.replace("_", " ")}
                      </Badge>
                      <Select
                        value={u.role}
                        onChange={(e) => changeRole(u, e.target.value as UserRole)}
                        className="h-8 w-32 text-xs"
                      >
                        <option value="student">Student</option>
                        <option value="club_leader">Club Leader</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(u)}
                        aria-label="Edit user"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteUser(u)}
                        disabled={deleting === u.id}
                        aria-label="Delete user"
                      >
                        {deleting === u.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4 text-destructive" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-faint">
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserEditDialog
        open={!!editing}
        user={editing}
        onClose={() => setEditing(null)}
        onSaved={(u) => setUsers((l) => l.map((x) => (x.id === u.id ? u : x)))}
      />
    </div>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-2xl font-medium text-ink">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-ink-faint">{subtitle}</p>}
    </div>
  );
}
