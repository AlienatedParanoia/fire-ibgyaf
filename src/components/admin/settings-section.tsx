"use client";

import * as React from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { SectionHeading } from "./users-section";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export function SettingsSection() {
  const [name, setName] = React.useState("F.I.R.E");
  const [tagline, setTagline] = React.useState("Your gateway to every opportunity");
  const [contactEmail, setContactEmail] = React.useState("");
  const [allowSubmissions, setAllowSubmissions] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowser();
      if (!supabase) { setLoading(false); return; }
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (error) {
        // Table not created yet — keep defaults, surface a hint.
        toast.error("Run the Admin PR 4 migration to enable saved settings.");
      } else if (data) {
        setName(data.site_name ?? "F.I.R.E");
        setTagline(data.tagline ?? "");
        setContactEmail(data.contact_email ?? "");
        setAllowSubmissions(data.allow_submissions ?? true);
      }
      setLoading(false);
    })();
  }, []);

  async function save() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        site_name: name.trim() || "F.I.R.E",
        tagline: tagline.trim(),
        contact_email: contactEmail.trim() || null,
        allow_submissions: allowSubmissions,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }

  return (
    <div>
      <SectionHeading title="Settings" subtitle="Configure your F.I.R.E platform" />
      <div className="max-w-xl space-y-5 rounded-2xl border border-ink/10 bg-panel p-6 shadow-sm">
        {loading ? (
          <p className="flex items-center gap-2 py-6 text-sm text-ink-faint">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading settings…
          </p>
        ) : (
          <>
            <div>
              <Label htmlFor="s-name">Platform name</Label>
              <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="s-tag">Tagline</Label>
              <Input id="s-tag" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="s-email">Contact email</Label>
              <Input id="s-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="hello@fire.sg" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-ink/10 p-4">
              <div>
                <p className="text-sm font-medium text-ink">Allow community submissions</p>
                <p className="text-xs text-ink-faint">
                  Let anyone suggest competitions and clubs via the /submit page.
                </p>
              </div>
              <button
                role="switch"
                aria-checked={allowSubmissions}
                onClick={() => setAllowSubmissions((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  allowSubmissions ? "bg-ember" : "bg-ink/20"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    allowSubmissions ? "left-[1.375rem]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
