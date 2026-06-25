"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  PlusCircle,
  Loader2,
  Trash2,
  FolderHeart,
  Globe,
  Lock,
  Link2,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ActivityCard } from "./activity-card";
import { DownloadResumeButton, type ResumeProfile } from "./resume-document";
import { CATEGORIES, cn } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { CustomActivity, Participation } from "@/lib/types";

export function PortfolioView({
  userId,
  initialActivities,
  initialPublic,
  achievements = [],
  profile,
}: {
  userId: string;
  initialActivities: CustomActivity[];
  initialPublic: boolean;
  achievements?: Participation[];
  profile: ResumeProfile;
}) {
  const [activities, setActivities] = React.useState(initialActivities);
  const [isPublic, setIsPublic] = React.useState(initialPublic);
  const [togglePending, setTogglePending] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  async function togglePublic() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    const next = !isPublic;
    setTogglePending(true);
    const { error } = await supabase.from("users").update({ is_portfolio_public: next }).eq("id", userId);
    setTogglePending(false);
    if (error) return toast.error(error.message);
    setIsPublic(next);
    toast.success(next ? "Portfolio is now public 🌍" : "Portfolio is now private 🔒");
  }

  function copyLink() {
    const url = `${window.location.origin}/portfolio/${userId}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard");
  }

  async function removeActivity(a: CustomActivity) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setActivities((list) => list.filter((x) => x.id !== a.id));
    await supabase.from("custom_activities").delete().eq("id", a.id);
    toast.success("Activity removed");
  }

  return (
    <div>
      {/* visibility controls */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-charcoal/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              isPublic ? "bg-emerald-50 text-emerald-600" : "bg-charcoal/5 text-charcoal/60"
            )}
          >
            {isPublic ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </span>
          <div>
            <p className="text-sm font-semibold text-charcoal">
              {isPublic ? "Public portfolio" : "Private portfolio"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPublic
                ? "Anyone with the link can view your showcase."
                : "Only you can see this. Make it public to share."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPublic && (
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Link2 className="h-4 w-4" /> Copy link
            </Button>
          )}
          <Button
            variant={isPublic ? "subtle" : "default"}
            size="sm"
            onClick={togglePublic}
            disabled={togglePending}
          >
            {togglePending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPublic ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            {isPublic ? "Make private" : "Make public"}
          </Button>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {activities.length} activit{activities.length === 1 ? "y" : "ies"} showcased
        </p>
        <div className="flex items-center gap-2">
          <DownloadResumeButton profile={profile} achievements={achievements} activities={activities} />
          <Button onClick={() => setAddOpen(true)}>
            <PlusCircle className="h-4 w-4" /> Add Activity
          </Button>
        </div>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={<FolderHeart className="h-7 w-7" />}
          title="Your portfolio is empty"
          description="Showcase your achievements — add an activity with a photo as proof."
          actionLabel="Add your first activity"
          onAction={() => setAddOpen(true)}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
            >
              <ActivityCard
                activity={a}
                action={
                  <button
                    onClick={() => removeActivity(a)}
                    aria-label="Delete activity"
                    className="rounded-lg bg-white/90 p-1.5 text-destructive shadow-sm backdrop-blur transition-colors hover:bg-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                }
              />
            </motion.div>
          ))}
        </div>
      )}

      <AddActivityDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        userId={userId}
        onAdded={(a) => setActivities((list) => [a, ...list])}
      />
    </div>
  );
}

function AddActivityDialog({
  open,
  onClose,
  userId,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
  onAdded: (a: CustomActivity) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    date: "",
    category: "Other",
    notes: "",
  });

  function pickFile(f: File | null) {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function reset() {
    setForm({ title: "", description: "", date: "", category: "Other", notes: "" });
    pickFile(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setLoading(true);

    let image_url: string | null = null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setLoading(false);
        return toast.error("Image must be under 5 MB.");
      }
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("proofs").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) {
        setLoading(false);
        return toast.error(`Upload failed: ${upErr.message}`);
      }
      image_url = supabase.storage.from("proofs").getPublicUrl(path).data.publicUrl;
    }

    const { data, error } = await supabase
      .from("custom_activities")
      .insert({
        user_id: userId,
        title: form.title,
        description: form.description || null,
        date: form.date || null,
        category: form.category,
        notes: form.notes || null,
        image_url,
      })
      .select()
      .single();
    setLoading(false);
    if (error) return toast.error(error.message);
    onAdded(data as CustomActivity);
    toast.success("Activity added to your portfolio 🎉");
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add to portfolio" className="max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        {/* image proof uploader */}
        <div>
          <Label>Proof image (optional)</Label>
          {preview ? (
            <div className="relative overflow-hidden rounded-xl border border-charcoal/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="h-44 w-full object-cover" />
              <button
                type="button"
                onClick={() => pickFile(null)}
                className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-destructive shadow-sm"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-charcoal/15 bg-muted/40 text-muted-foreground transition-colors hover:border-fire/40 hover:bg-fire-50/40">
              <UploadCloud className="h-7 w-7" />
              <span className="text-sm font-medium">Click to upload a photo</span>
              <span className="text-xs">PNG / JPG · up to 5 MB</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              />
            </label>
          )}
        </div>

        <div>
          <Label htmlFor="p-title">Title *</Label>
          <Input
            id="p-title"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Won 1st place — SSEF 2026"
          />
        </div>
        <div>
          <Label htmlFor="p-desc">Description</Label>
          <Textarea
            id="p-desc"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="p-date">Date</Label>
            <Input
              id="p-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="p-cat">Category</Label>
            <Select
              id="p-cat"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="p-notes">Notes</Label>
          <Textarea
            id="p-notes"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving…" : "Add activity"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
