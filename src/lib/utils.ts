import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Days until a date (negative if past). */
export function daysUntil(date: string | Date | null | undefined): number | null {
  if (!date) return null;
  const target = new Date(date);
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
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
}
