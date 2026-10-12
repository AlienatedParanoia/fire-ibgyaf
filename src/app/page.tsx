import { LandingExperience } from "@/components/landing/landing-experience";
import { getSupabasePublic } from "@/lib/supabase/public";
import { AnnouncementsStrip } from "@/components/announcements/announcements-strip";
import type { Announcement, StudentNote } from "@/lib/types";

// The wall only shows admin-approved notes, so a 5-minute ISR window is plenty
// fresh — and keeps the landing page cached instead of hitting the DB per view.
export const revalidate = 300;

export default async function LandingPage() {
  const supabase = getSupabasePublic();
  let notes: StudentNote[] = [];
  let announcements: Pick<Announcement, "id" | "title">[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("student_notes")
      .select("id, user_id, author_name, author_school, body, status, admin_notes, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(12);
    notes = (data ?? []) as StudentNote[];

    const { data: anns } = await supabase
      .from("announcements")
      .select("id, title")
      .eq("status", "approved")
      .eq("priority", "high")
      .order("created_at", { ascending: false })
      .limit(3);
    announcements = (anns ?? []) as typeof announcements;
  }
  return (
    <>
      <AnnouncementsStrip items={announcements} />
      <LandingExperience notes={notes} />
    </>
  );
}
