"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea, Label } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { CATEGORIES } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { AppUser, Club } from "@/lib/types";

type FormState = {
  name: string;
  category: string;
  description: string;
  meeting_schedule: string;
  contact_email: string;
  contact_person: string;
  logo_url: string | null;
  banner_url: string | null;
  leader_id: string;
  is_approved: boolean;
};

const EMPTY: FormState = {
  name: "", category: "", description: "",
  meeting_schedule: "", contact_email: "", contact_person: "",
  logo_url: null, banner_url: null, leader_id: "",
  is_approved: true,
};

function fromClub(c: Club): FormState {
  return {
    name: c.name, category: c.category ?? "",
    description: c.description ?? "",
    meeting_schedule: c.meeting_schedule ?? "",
    contact_email: c.contact_email ?? "",
    contact_person: c.contact_person ?? "",
    logo_url: c.logo_url ?? null,
    banner_url: c.banner_url ?? null,
    leader_id: c.leader_id ?? "",
    is_approved: c.is_approved,
  };
}

/**
 * Shared add/edit dialog for clubs. Pass `club` to edit an existing one, or `null`
 * to create a new one. Calls `onSaved` with the created/updated row.
 */
export function ClubFormDialog({
  open,
  onClose,
  club,
  onSaved,
  showAdminToggles = true,
  users = [],
}: {
  open: boolean;
  onClose: () => void;
  club: Club | null;
  onSaved: (c: Club) => void;
  showAdminToggles?: boolean;
  users?: AppUser[];
}) {
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) setForm(club ? fromClub(club) : EMPTY);
  }, [open, club]);

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

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
      logo_url: form.logo_url || null,
      banner_url: form.banner_url || null,
      leader_id: form.leader_id || null,
      is_approved: form.is_approved,
    };
    if (club) {
      const { error } = await supabase.from("clubs").update(payload).eq("id", club.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      onSaved({ ...club, ...payload });
      toast.success("Club updated");
    } else {
      const { data, error } = await supabase.from("clubs").insert({ ...payload, member_count: 0 }).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      onSaved(data as Club);
      toast.success("Club created");
    }
    setSaving(false);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={club ? "Edit Club" : "Add Club"}
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
        <div>
          <Label>Club leader</Label>
          <Select value={form.leader_id} onChange={set("leader_id")}>
            <option value="">No leader assigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
            ))}
          </Select>
        </div>
        <div className="flex items-end gap-4">
          <ImageUpload
            label="Logo"
            value={form.logo_url}
            onChange={(url) => setForm((f) => ({ ...f, logo_url: url }))}
            pathPrefix="clubs/logos"
            aspect="square"
            className="shrink-0"
          />
        </div>
        <div className="sm:col-span-2">
          <ImageUpload
            label="Banner image"
            value={form.banner_url}
            onChange={(url) => setForm((f) => ({ ...f, banner_url: url }))}
            pathPrefix="clubs/banners"
          />
        </div>
        {showAdminToggles && (
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_approved}
              onChange={(e) => setForm((f) => ({ ...f, is_approved: e.target.checked }))}
              className="h-4 w-4 accent-ember"
            />
            <span className="text-sm font-medium text-ink">Approved (visible to students)</span>
          </label>
        )}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="sketch" onClick={onClose}>Cancel</Button>
        <Button variant="ember" onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {club ? "Save Changes" : "Create Club"}
        </Button>
      </div>
    </Dialog>
  );
}
