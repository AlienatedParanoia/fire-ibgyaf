"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea, Label } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { CategoryBadge } from "@/components/competitions/badges";
import { CATEGORIES, cn } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { SectionHeading } from "./users-section";
import type { Club } from "@/lib/types";

type FormState = {
  name: string;
  category: string;
  description: string;
  meeting_schedule: string;
  contact_email: string;
  contact_person: string;
  is_approved: boolean;
};

const EMPTY: FormState = {
  name: "", category: "", description: "",
  meeting_schedule: "", contact_email: "", contact_person: "",
  is_approved: true,
};

export function ClubsManage({ initial }: { initial: Club[] }) {
  const [items, setItems] = React.useState(initial);
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [editing, setEditing] = React.useState<Club | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const filtered = items.filter((c) => {
    if (q && !`${c.name} ${c.contact_person ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (statusFilter === "approved" && !c.is_approved) return false;
    if (statusFilter === "pending" && c.is_approved) return false;
    return true;
  });

  function openAdd() {
    setForm(EMPTY);
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(c: Club) {
    setForm({
      name: c.name, category: c.category ?? "",
      description: c.description ?? "",
      meeting_schedule: c.meeting_schedule ?? "",
      contact_email: c.contact_email ?? "",
      contact_person: c.contact_person ?? "",
      is_approved: c.is_approved,
    });
    setEditing(c);
    setDialogOpen(true);
  }

  function closeDialog() { setDialogOpen(false); setEditing(null); }

  async function save() {
    if (!form.name.trim()) return toast.error("Club name is required.");
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      category: form.category || null,
      description: form.description || null,
      meeting_schedule: form.meeting_schedule || null,
      contact_email: form.contact_email || null,
      contact_person: form.contact_person || null,
      is_approved: form.is_approved,
    };
    if (editing) {
      const { error } = await supabase.from("clubs").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      setItems((l) => l.map((c) => c.id === editing.id ? { ...c, ...payload } : c));
      toast.success("Club updated");
    } else {
      const { data, error } = await supabase.from("clubs").insert({ ...payload, member_count: 0 }).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      setItems((l) => [data as Club, ...l]);
      toast.success("Club created");
    }
    setSaving(false);
    closeDialog();
  }

  async function toggleApprove(c: Club) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const next = !c.is_approved;
    setItems((l) => l.map((x) => x.id === c.id ? { ...x, is_approved: next } : x));
    const { error } = await supabase.from("clubs").update({ is_approved: next }).eq("id", c.id);
    if (error) {
      toast.error(error.message);
      setItems((l) => l.map((x) => x.id === c.id ? { ...x, is_approved: !next } : x));
      return;
    }
    toast.success(next ? "Approved" : "Unapproved");
  }

  async function deleteItem(c: Club) {
    if (!confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setDeleting(c.id);
    const { error } = await supabase.from("clubs").delete().eq("id", c.id);
    if (error) { toast.error(error.message); setDeleting(null); return; }
    setItems((l) => l.filter((x) => x.id !== c.id));
    toast.success("Deleted");
    setDeleting(null);
  }

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <SectionHeading title="Manage Clubs" subtitle={`${items.length} clubs total`} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <Input placeholder="Search clubs…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
          <option value="">All statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </Select>
        <Button variant="ember" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Club
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink/10 bg-panel shadow-sm">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-paper text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Members</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-ink-faint">No clubs found.</td>
                </tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{c.name}</p>
                    <p className="text-xs text-ink-faint">{c.meeting_schedule ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3"><CategoryBadge category={c.category} /></td>
                  <td className="px-4 py-3 text-ink-soft">{c.contact_person ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{c.member_count}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleApprove(c)}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
                        c.is_approved
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      )}
                    >
                      {c.is_approved ? "✓ Approved" : "Pending"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteItem(c)}
                        disabled={deleting === c.id}
                        aria-label="Delete"
                      >
                        {deleting === c.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4 text-destructive" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        title={editing ? "Edit Club" : "Add Club"}
        className="max-w-xl"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Club Name *</Label>
            <Input value={form.name} onChange={set("name")} placeholder="Club name" />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onChange={set("category")}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label>Meeting Schedule</Label>
            <Input value={form.meeting_schedule} onChange={set("meeting_schedule")} placeholder="e.g. Wednesdays 3–5pm" />
          </div>
          <div>
            <Label>Contact Person</Label>
            <Input value={form.contact_person} onChange={set("contact_person")} placeholder="Teacher / leader name" />
          </div>
          <div>
            <Label>Contact Email</Label>
            <Input type="email" value={form.contact_email} onChange={set("contact_email")} placeholder="email@school.edu.sg" />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={set("description")} placeholder="What does this club do?" />
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_approved}
              onChange={(e) => setForm((f) => ({ ...f, is_approved: e.target.checked }))}
              className="h-4 w-4 accent-ember"
            />
            <span className="text-sm font-medium text-ink">Approved (visible to students)</span>
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="sketch" onClick={closeDialog}>Cancel</Button>
          <Button variant="ember" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editing ? "Save Changes" : "Create Club"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
