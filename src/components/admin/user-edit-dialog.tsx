"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Label } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { CATEGORIES, categoryColor, cn } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { AppUser, UserRole } from "@/lib/types";

/** Admin dialog to edit every field of a user's profile. */
export function UserEditDialog({
  open,
  onClose,
  user,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  user: AppUser | null;
  onSaved: (u: AppUser) => void;
}) {
  const [form, setForm] = React.useState<AppUser | null>(user);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => { if (open) setForm(user); }, [open, user]);

  if (!form) return null;

  const set = <K extends keyof AppUser>(k: K, v: AppUser[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  function toggleInterest(cat: string) {
    setForm((f) => {
      if (!f) return f;
      const has = f.interests.includes(cat);
      return { ...f, interests: has ? f.interests.filter((c) => c !== cat) : [...f.interests, cat] };
    });
  }

  async function save() {
    if (!form) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setSaving(true);
    const payload = {
      full_name: form.full_name || null,
      school: form.school || null,
      grade: form.grade || null,
      role: form.role,
      avatar_url: form.avatar_url || null,
      interests: form.interests,
      email_reminders: form.email_reminders,
      is_portfolio_public: form.is_portfolio_public,
    };
    const { error } = await supabase.from("users").update(payload).eq("id", form.id);
    if (error) { toast.error(error.message); setSaving(false); return; }
    onSaved({ ...form, ...payload });
    toast.success("User updated");
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Edit user" className="max-w-2xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-end gap-3 sm:col-span-2">
          <ImageUpload
            label="Avatar"
            value={form.avatar_url}
            onChange={(url) => set("avatar_url", url)}
            pathPrefix="avatars"
            aspect="square"
            className="shrink-0"
          />
          <p className="pb-2 text-xs text-ink-faint">{form.email}</p>
        </div>
        <div>
          <Label>Full name</Label>
          <Input value={form.full_name ?? ""} onChange={(e) => set("full_name", e.target.value)} />
        </div>
        <div>
          <Label>Role</Label>
          <Select value={form.role} onChange={(e) => set("role", e.target.value as UserRole)}>
            <option value="student">Student</option>
            <option value="club_leader">Club Leader</option>
            <option value="admin">Admin</option>
          </Select>
        </div>
        <div>
          <Label>School</Label>
          <Input value={form.school ?? ""} onChange={(e) => set("school", e.target.value)} />
        </div>
        <div>
          <Label>Grade</Label>
          <Input value={form.grade ?? ""} onChange={(e) => set("grade", e.target.value)} placeholder="e.g. Secondary 3" />
        </div>
        <div className="sm:col-span-2">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = form.interests.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleInterest(cat)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                    active ? cn("border-transparent", categoryColor(cat)) : "border-ink/15 text-ink-soft hover:border-ink/30"
                  )}
                >
                  {active && <Check className="h-3.5 w-3.5" />} {cat}
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.email_reminders}
            onChange={(e) => set("email_reminders", e.target.checked)}
            className="h-4 w-4 accent-ember"
          />
          <span className="text-sm font-medium text-ink">Email reminders</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.is_portfolio_public}
            onChange={(e) => set("is_portfolio_public", e.target.checked)}
            className="h-4 w-4 accent-ember"
          />
          <span className="text-sm font-medium text-ink">Public portfolio</span>
        </label>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="sketch" onClick={onClose}>Cancel</Button>
        <Button variant="ember" onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Changes
        </Button>
      </div>
    </Dialog>
  );
}
