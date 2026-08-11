import { LandingExperience } from "@/components/landing/landing-experience";
import { getSupabasePublic } from "@/lib/supabase/public";
import type { StudentNote } from "@/lib/types";

// The wall only shows admin-approved notes, so a 5-minute ISR window is plenty
// fresh — and keeps the landing page cached instead of hitting the DB per view.
export const revalidate = 300;

export default async function LandingPage() {
  const supabase = getSupabasePublic();
  let notes: StudentNote[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("student_notes")
      .select("id, user_id, author_name, author_school, body, status, admin_notes, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(12);
    notes = (data ?? []) as StudentNote[];
  }
  return <LandingExperience notes={notes} />;
}
