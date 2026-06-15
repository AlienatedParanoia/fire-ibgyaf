"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea, Label } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { CategoryBadge } from "@/components/competitions/badges";
import { CATEGORIES, cn, formatDate } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { SectionHeading } from "./users-section";
import type { Competition, CompFormat, CompRegion } from "@/lib/types";

type FormState = {
  title: string;
  organizer: string;
  description: string;
  category: string;
  format: CompFormat;
  region: CompRegion;
  deadline: string;
  event_date: string;
  eligibility: string;
  registration_link: string;
  prize: string;
  is_approved: boolean;
  is_featured: boolean;
};

const EMPTY: FormState = {
  title: "", organizer: "", description: "", category: "",
  format: "online", region: "Singapore",
  deadline: "", event_date: "", eligibility: "",
  registration_link: "", prize: "",
  is_approved: true, is_featured: false,
};

export function CompetitionsManage({ initial }: { initial: Competition[] }) {
  const [items, setItems] = React.useState(initial);
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [editing, setEditing] = React.useState<Competition | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const filtered = items.filter((c) => {
    if (q && !`${c.title} ${c.organizer ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (statusFilter === "approved" && !c.is_approved) return false;
    if (statusFilter === "pending" && c.is_approved) return false;
    return true;
  });

  function openAdd() {
    setForm(EMPTY);
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(c: Competition) {
    setForm({
      title: c.title, organizer: c.organizer ?? "",
      description: c.description ?? "", category: c.category ?? "",
      format: c.format, region: c.region,
      deadline: c.deadline?.split("T")[0] ?? "",
      event_date: c.event_date?.split("T")[0] ?? "",
      eligibility: c.eligibility ?? "",
      registration_link: c.registration_link ?? "",
      prize: c.prize ?? "",
      is_approved: c.is_approved, is_featured: c.is_featured,
    });
    setEditing(c);
    setDialogOpen(true);
  }

  function closeDialog() { setDialogOpen(false); setEditing(null); }

  async function save() {
    if (!form.title.trim()) return toast.error("Title is required.");
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      organizer: form.organizer || null,
      description: form.description || null,
      category: form.category || null,
      format: form.format,
      region: form.region,
      deadline: form.deadline || null,
      event_date: form.event_date || null,
      eligibility: form.eligibility || null,
      registration_link: form.registration_link || null,
      prize: form.prize || null,
      is_approved: form.is_approved,
      is_featured: form.is_featured,
    };
    if (editing) {
      const { error } = await supabase.from("competitions").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      setItems((l) => l.map((c) => c.id === editing.id ? { ...c, ...payload } : c));
      toast.success("Competition updated");
    } else {
      const { data, error } = await supabase.from("competitions").insert(payload).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      setItems((l) => [data as Competition, ...l]);
      toast.success("Competition created");
    }
    setSaving(false);
    closeDialog();
  }

  async function toggleApprove(c: Competition) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const next = !c.is_approved;
    setItems((l) => l.map((x) => x.id === c.id ? { ...x, is_approved: next } : x));
    await supabase.from("competitions").update({ is_approved: next }).eq("id", c.id);
    toast.success(next ? "Approved" : "Unapproved");
  }

  async function toggleFeature(c: Competition) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const next = !c.is_featured;
    setItems((l) => l.map((x) => x.id === c.id ? { ...x, is_featured: next } : x));
    await supabase.from("competitions").update({ is_featured: next }).eq("id", c.id);
    toast.success(next ? "Featured" : "Unfeatured");
  }

  async function deleteItem(c: Competition) {
    if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setDeleting(c.id);
    const { error } = await supabase.from("competitions").delete().eq("id", c.id);
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
      <SectionHeading title="Manage Competitions" subtitle={`${items.length} competitions total`} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <Input placeholder="Search competitions…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
          <option value="">All statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </Select>
        <Button variant="ember" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Competition
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink/10 bg-panel shadow-sm">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-paper text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-ink-faint">
                    No competitions found.
                  </td>
                </tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{c.title}</p>
                    <p className="text-xs text-ink-faint">{c.organizer ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3"><CategoryBadge category={c.category} /></td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(c.deadline)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
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
                      <button
                        onClick={() => toggleFeature(c)}
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
                          c.is_featured
                            ? "bg-ember/10 text-ember hover:bg-ember/20"
                            : "bg-ink/5 text-ink-faint hover:bg-ink/10"
                        )}
                      >
                        {c.is_featured ? "★ Featured" : "Feature"}
                      </button>
                    </div>
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
        title={editing ? "Edit Competition" : "Add Competition"}
        className="max-w-2xl"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Title *</Label>
            <Input value={form.title} onChange={set("title")} placeholder="Competition name" />
          </div>
          <div>
            <Label>Organiser</Label>
            <Input value={form.organizer} onChange={set("organizer")} placeholder="e.g. MOE, NUS" />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onChange={set("category")}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label>Format</Label>
            <Select value={form.format} onChange={set("format")}>
              <option value="online">Online</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </Select>
          </div>
          <div>
            <Label>Region</Label>
            <Select value={form.region} onChange={set("region")}>
              <option value="Singapore">Singapore</option>
              <option value="Global">Global</option>
              <option value="Both">Both</option>
            </Select>
          </div>
          <div>
            <Label>Registration Deadline</Label>
            <Input type="date" value={form.deadline} onChange={set("deadline")} />
          </div>
          <div>
            <Label>Event Date</Label>
            <Input type="date" value={form.event_date} onChange={set("event_date")} />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={set("description")} placeholder="Describe the competition…" />
          </div>
          <div>
            <Label>Eligibility</Label>
            <Input value={form.eligibility} onChange={set("eligibility")} placeholder="e.g. Sec 3–5, open to all" />
          </div>
          <div>
            <Label>Prize</Label>
            <Input value={form.prize} onChange={set("prize")} placeholder="e.g. $1,000 cash prize" />
          </div>
          <div className="sm:col-span-2">
            <Label>Registration Link</Label>
            <Input type="url" value={form.registration_link} onChange={set("registration_link")} placeholder="https://…" />
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
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
              className="h-4 w-4 accent-ember"
            />
            <span className="text-sm font-medium text-ink">Featured (pinned to top)</span>
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="sketch" onClick={closeDialog}>Cancel</Button>
          <Button variant="ember" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editing ? "Save Changes" : "Create Competition"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
