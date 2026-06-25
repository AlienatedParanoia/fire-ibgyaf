"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CATEGORIES, categoryColor, cn } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";

/**
 * Lets a student pick the competition categories they care about. Saved to
 * `users.interests` and used to rank the personalised "For You" feed.
 */
export function InterestsDialog({
  open,
  onClose,
  initialInterests,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  initialInterests: string[];
  onSaved: (interests: string[]) => void;
}) {
  const [selected, setSelected] = React.useState<string[]>(initialInterests);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) setSelected(initialInterests);
  }, [open, initialInterests]);

  function toggle(cat: string) {
    setSelected((s) => (s.includes(cat) ? s.filter((c) => c !== cat) : [...s, cat]));
  }

  async function save() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) { setSaving(false); return toast.error("Please log in again."); }
    const { error } = await supabase.from("users").update({ interests: selected }).eq("id", uid);
    if (error) { toast.error(error.message); setSaving(false); return; }
    onSaved(selected);
    toast.success("Interests saved");
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Your interests" className="max-w-lg">
      <p className="-mt-1 mb-4 text-sm text-ink-faint">
        Pick the categories you care about. We&apos;ll use them to surface competitions for you.
      </p>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active = selected.includes(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggle(cat)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? cn("border-transparent", categoryColor(cat))
                  : "border-ink/15 text-ink-soft hover:border-ink/30"
              )}
            >
              {active && <Check className="h-3.5 w-3.5" />}
              {cat}
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="sketch" onClick={onClose}>Cancel</Button>
        <Button variant="ember" onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save interests
        </Button>
      </div>
    </Dialog>
  );
}
