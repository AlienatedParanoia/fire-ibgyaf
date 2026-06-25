"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * Reusable image upload + preview. Uploads to a public Supabase Storage bucket
 * (default "media") under `pathPrefix/<timestamp>.<ext>` and reports the public
 * URL via onChange. Also accepts a pasted URL. Generalises the portfolio
 * proof-image uploader for admin use (club logos/banners, competition banners,
 * avatars). Requires the bucket + admin write policy (migration-admin.sql).
 */
export function ImageUpload({
  label,
  value,
  onChange,
  bucket = "media",
  pathPrefix = "misc",
  aspect = "video",
  className,
}: {
  label?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
  pathPrefix?: string;
  aspect?: "video" | "square";
  className?: string;
}) {
  const [uploading, setUploading] = React.useState(false);

  async function upload(file: File) {
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB.");
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${pathPrefix}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) { setUploading(false); return toast.error(`Upload failed: ${error.message}`); }
    const url = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    onChange(url);
    setUploading(false);
  }

  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      {value ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border border-ink/12",
            aspect === "square" ? "aspect-square w-28" : "aspect-[16/7]"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove image"
            className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-destructive shadow-sm transition-colors hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-ink/15 bg-paper text-ink-faint transition-colors hover:border-ember/40 hover:bg-ember/5",
            aspect === "square" ? "aspect-square w-28" : "h-28"
          )}
        >
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
          <span className="text-xs font-medium">{uploading ? "Uploading…" : "Upload image"}</span>
          <span className="text-[10px]">PNG / JPG · up to 5 MB</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
          />
        </label>
      )}
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        placeholder="…or paste an image URL"
        className="mt-2"
      />
    </div>
  );
}
