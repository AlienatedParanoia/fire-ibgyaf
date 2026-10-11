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
