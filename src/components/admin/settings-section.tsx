"use client";

import * as React from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { SectionHeading } from "./users-section";

export function SettingsSection() {
  const [name, setName] = React.useState("F.I.R.E");
  const [tagline, setTagline] = React.useState("Your gateway to every opportunity");
  const [allowSubmissions, setAllowSubmissions] = React.useState(true);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("fire-settings");
      if (raw) {
        const s = JSON.parse(raw);
        setName(s.name ?? "F.I.R.E");
        setTagline(s.tagline ?? "");
        setAllowSubmissions(s.allowSubmissions ?? true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function save() {
    localStorage.setItem(
      "fire-settings",
      JSON.stringify({ name, tagline, allowSubmissions })
    );
    toast.success("Settings saved");
  }

  return (
    <div>
      <SectionHeading title="Settings" subtitle="Configure your F.I.R.E platform" />
      <div className="max-w-xl space-y-5 rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm">
        <div>
          <Label htmlFor="s-name">Platform name</Label>
          <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="s-tag">Tagline</Label>
          <Input id="s-tag" value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-charcoal/10 p-4">
          <div>
            <p className="text-sm font-medium text-charcoal">Allow community submissions</p>
            <p className="text-xs text-muted-foreground">
              Let anyone suggest competitions and clubs via the /submit page.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={allowSubmissions}
            onClick={() => setAllowSubmissions((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              allowSubmissions ? "bg-fire" : "bg-charcoal/20"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                allowSubmissions ? "left-[1.375rem]" : "left-0.5"
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Settings are stored locally for this demo. Wire them to a <code>platform_settings</code>{" "}
          table to persist across devices.
        </p>
        <Button onClick={save}>
          <Save className="h-4 w-4" /> Save settings
        </Button>
      </div>
    </div>
  );
}
