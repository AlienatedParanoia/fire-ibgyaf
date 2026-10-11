import type { Club } from "@/lib/types";

/**
 * Club columns readable by signed-out visitors. Keep in sync with the column-level
 * GRANT in supabase/migration-lovable-clubs.sql: `contact_email` and `contact_phone`
 * are deliberately excluded, so a signed-out `select("*")` on clubs fails.
 */
export const CLUB_PUBLIC_COLUMNS = [
  "id", "name", "description", "category", "meeting_schedule", "contact_person",
  "logo_url", "banner_url", "leader_id", "is_approved", "member_count", "created_at",
  "vision", "mission", "president", "vice_president", "secretary", "treasurer",
  "instagram", "linkedin", "website", "grade_requirements", "is_open", "school", "tags",
].join(", ");

/** Columns only signed-in users may read. */
export const CLUB_CONTACT_COLUMNS = "contact_email, contact_phone";


/**
 * Something real to say about a club even when nobody has written a description yet:
 * description → mission → vision → a sentence built from the club's own fields.
 */
export function clubBlurb(club: Club): string {
  const written = club.description || club.mission || club.vision;
  if (written) return written;
  const kind = club.category ? `${club.category} club` : "club";
  const school = club.school ? ` at ${club.school}` : "";
  const leaders = [club.president, club.vice_president].filter(Boolean);
  const led = leaders.length ? ` Led by ${leaders.join(" and ")}.` : "";
  const open = club.is_open === false ? " Currently closed to new members." : " Open to new members.";
  return `A student-led ${kind}${school}.${led}${open}`;
}

/** "President X · VP Y" line for cards. */
export function clubLeadersLine(club: Club): string | null {
  const parts = [
    club.president && `President ${club.president}`,
    club.vice_president && `VP ${club.vice_president}`,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

const GRADIENTS: Record<string, string> = {
  stem: "linear-gradient(135deg, #10B981 0%, #0E7490 100%)",
  science: "linear-gradient(135deg, #10B981 0%, #0E7490 100%)",
  tech: "linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%)",
  math: "linear-gradient(135deg, #6366F1 0%, #312E81 100%)",
  arts: "linear-gradient(135deg, #EC4899 0%, #9D174D 100%)",
  "arts & culture": "linear-gradient(135deg, #EC4899 0%, #9D174D 100%)",
  business: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
  debate: "linear-gradient(135deg, #A855F7 0%, #581C87 100%)",
  sports: "linear-gradient(135deg, #84CC16 0%, #3F6212 100%)",
  service: "linear-gradient(135deg, #F97316 0%, #9A3412 100%)",
  academic: "linear-gradient(135deg, #14B8A6 0%, #115E59 100%)",
  "health & science": "linear-gradient(135deg, #EF4444 0%, #7F1D1D 100%)",
  lifestyle: "linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)",
};
const DEFAULT_GRADIENT = "linear-gradient(135deg, #F75C4C 0%, #E0402F 70%, #020202 240%)";

/** Banner colour for a club with no uploaded image, so cards aren't all the same red. */
export function categoryGradient(category?: string | null): string {
  return GRADIENTS[(category ?? "").toLowerCase()] ?? DEFAULT_GRADIENT;
}
