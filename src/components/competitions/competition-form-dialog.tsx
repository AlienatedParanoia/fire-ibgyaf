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
import type { Club, Competition, CompFormat, CompRegion } from "@/lib/types";

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
  banner_url: string | null;
  club_id: string;
  is_approved: boolean;
  is_featured: boolean;
};

const EMPTY: FormState = {
  title: "", organizer: "", description: "", category: "",
  format: "online", region: "Singapore",
  deadline: "", event_date: "", eligibility: "",
  registration_link: "", prize: "",
  banner_url: null, club_id: "",
  is_approved: true, is_featured: false,
};

function fromCompetition(c: Competition): FormState {
  return {
    title: c.title, organizer: c.organizer ?? "",
    description: c.description ?? "", category: c.category ?? "",
    format: c.format, region: c.region,
    deadline: c.deadline?.split("T")[0] ?? "",
    event_date: c.event_date?.split("T")[0] ?? "",
    eligibility: c.eligibility ?? "",
    registration_link: c.registration_link ?? "",
    prize: c.prize ?? "",
    banner_url: c.banner_url ?? null,
    club_id: c.club_id ?? "",
    is_approved: c.is_approved, is_featured: c.is_featured,
  };
}

/**
 * Shared add/edit dialog for competitions. Pass `competition` to edit an existing
 * one, or `null` to create a new one. Calls `onSaved` with the created/updated row.
 */
export function CompetitionFormDialog({
  open,
  onClose,
  competition,
  onSaved,
  showAdminToggles = true,
  clubs = [],
}: {
  open: boolean;
  onClose: () => void;
  competition: Competition | null;
  onSaved: (c: Competition) => void;
  showAdminToggles?: boolean;
  clubs?: Club[];
}) {
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [saving, setSaving] = React.useState(false);

  // Sync the form whenever the dialog opens for a (different) competition.
  React.useEffect(() => {
    if (open) setForm(competition ? fromCompetition(competition) : EMPTY);
  }, [open, competition]);

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

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
      banner_url: form.banner_url || null,
      club_id: form.club_id || null,
      is_approved: form.is_approved,
      is_featured: form.is_featured,
    };
    if (competition) {
      const { error } = await supabase.from("competitions").update(payload).eq("id", competition.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      onSaved({ ...competition, ...payload });
      toast.success("Competition updated");
    } else {
      const { data, error } = await supabase.from("competitions").insert(payload).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      onSaved(data as Competition);
      toast.success("Competition created");
    }
    setSaving(false);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={competition ? "Edit Competition" : "Add Competition"}
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
        <div>
          <Label>Hosting club</Label>
          <Select value={form.club_id} onChange={set("club_id")}>
            <option value="">No club</option>
            {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <ImageUpload
            label="Banner image"
            value={form.banner_url}
            onChange={(url) => setForm((f) => ({ ...f, banner_url: url }))}
            pathPrefix="competitions"
          />
        </div>
        {showAdminToggles && (
          <>
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
          </>
        )}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="sketch" onClick={onClose}>Cancel</Button>
        <Button variant="ember" onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {competition ? "Save Changes" : "Create Competition"}
        </Button>
      </div>
    </Dialog>
  );
}
