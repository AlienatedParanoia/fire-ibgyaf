"use client";

import * as React from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, initials } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { AppUser, UserRole } from "@/lib/types";

const ROLE_STYLE: Record<UserRole, string> = {
  student: "bg-charcoal/10 text-charcoal/70",
  club_leader: "bg-electric-50 text-electric-700",
  admin: "bg-fire-50 text-fire-700",
};

export function UsersSection({ users: initial }: { users: AppUser[] }) {
  const [users, setUsers] = React.useState(initial);
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState("");

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
    setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", user.id);
    if (error) {
      toast.error(error.message);
      setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, role: user.role } : u)));
    } else {
      toast.success(`${user.full_name || user.email} is now ${newRole.replace("_", " ")}`);
    }
  }

  return (
    <div>
      <SectionHeading title="User Management" subtitle={`${users.length} registered users`} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

      <div className="overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-sm">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-charcoal/10 bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">School</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fire to-electric text-xs font-bold text-white">
                        {initials(u.full_name || u.email)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-charcoal">{u.full_name || "—"}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.school ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.grade ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(u.created_at)}</td>
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
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-2xl font-bold text-charcoal">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
