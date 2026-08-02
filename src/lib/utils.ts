import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Postgres `date` columns arrive as a bare YYYY-MM-DD, which Date parses as UTC
 * midnight — so the local getters below would read the previous day anywhere
 * west of UTC. Build those from their parts to keep the calendar day intact.
 */
function asLocalDate(date: string | Date): Date {
  if (typeof date === "string") {
    const parts = date.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (parts) return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  }
  return new Date(date);
}

/** Days until a date (negative if past). */
export function daysUntil(date: string | Date | null | undefined): number | null {
  if (!date) return null;
  const target = asLocalDate(date);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const a = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
}

/** Tailwind text colour for deadline urgency. */
export function deadlineUrgency(date: string | Date | null | undefined): {
  color: string;
  label: string;
} {
  const d = daysUntil(date);
  if (d === null) return { color: "text-ink-faint", label: "No deadline" };
  if (d < 0) return { color: "text-ink-faint", label: "Closed" };
  if (d <= 7) return { color: "text-coral", label: d === 0 ? "Due today" : `${d}d left` };
  if (d <= 30) return { color: "text-ink", label: `${d}d left` };
  return { color: "text-ink-faint", label: `${d}d left` };
}

/**
 * A user-supplied link is only safe in an href once its scheme is known: React
 * renders a `javascript:` URL despite warning about it, and the browser still
 * runs it. Returns null for anything that isn't http(s).
 */
export function safeHttpUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

/**
 * next/image only accepts Supabase Storage's public path (see the remotePatterns
 * in next.config.js); any other host — a pasted link, a signed URL — has to skip
 * the optimizer or the image just fails to load.
 */
export function optimizableImage(url: string): boolean {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!base && url.startsWith(`${base.replace(/\/$/, "")}/storage/v1/object/public/`);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
}

export function initials(name?: string | null): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export const CATEGORIES = [
  "STEM",
  "Arts",
  "Business",
  "Debate",
  "Sports",
  "Tech",
  "Math",
  "Science",
  "Other",
] as const;

/** Deterministic brand-ish colour for a category badge. */
export function categoryColor(category?: string | null): string {
  switch ((category || "").toLowerCase()) {
    case "stem":
    case "science":
      return "bg-emerald-100 text-emerald-700";
    case "tech":
      return "bg-electric-100 text-electric-700";
    case "math":
      return "bg-indigo-100 text-indigo-700";
    case "arts":
      return "bg-pink-100 text-pink-700";
    case "business":
      return "bg-amber-100 text-amber-700";
    case "debate":
      return "bg-purple-100 text-purple-700";
    case "sports":
      return "bg-lime-100 text-lime-700";
    default:
      return "bg-fire-100 text-fire-700";
  }
}

export function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    // Excel and Sheets run a leading =, +, - or @ as a formula, and these
    // fields carry student-typed text, so defuse them with a quote prefix.
    if (/^[=+\-@\t\r]/.test(s)) return `"'${s.replace(/"/g, '""')}"`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
}
