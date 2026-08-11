import { requireUser } from "@/lib/auth";
import { NotesComposer } from "@/components/notes/notes-composer";
import type { StudentNote } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Notes — F.I.R.E" };

export default async function NotesPage() {
  const { profile, supabase } = await requireUser();

  const { data } = await supabase
    .from("student_notes")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  return <NotesComposer profile={profile} initialNotes={(data ?? []) as StudentNote[]} />;
}
