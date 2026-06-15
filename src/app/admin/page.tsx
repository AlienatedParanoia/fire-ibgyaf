import { requireUser } from "@/lib/auth";
import { AdminPanel } from "@/components/admin/admin-panel";
import type {
  AppUser,
  Club,
  Competition,
  CommunitySubmission,
  Participation,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export interface AdminData {
  users: AppUser[];
  clubs: Club[];
  competitions: Competition[];
  submissions: CommunitySubmission[];
  participation: Participation[];
  analytics: { event_type: string; created_at: string; user_id: string | null }[];
}

export default async function AdminPage() {
  const { supabase } = await requireUser(["admin"]);

  const [usersRes, clubsRes, compsRes, subsRes, partRes, anRes] = await Promise.all([
    supabase.from("users").select("*").order("created_at", { ascending: false }),
    supabase.from("clubs").select("*").order("created_at", { ascending: false }),
    supabase.from("competitions").select("*").order("created_at", { ascending: false }),
    supabase.from("community_submissions").select("*").order("created_at", { ascending: false }),
    supabase.from("participation").select("*"),
    supabase
      .from("analytics_events")
      .select("event_type, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(2000),
  ]);

  const data: AdminData = {
    users: (usersRes.data ?? []) as AppUser[],
    clubs: (clubsRes.data ?? []) as Club[],
    competitions: (compsRes.data ?? []) as Competition[],
    submissions: (subsRes.data ?? []) as CommunitySubmission[],
    participation: (partRes.data ?? []) as Participation[],
    analytics: (anRes.data ?? []) as AdminData["analytics"],
  };

  return <AdminPanel data={data} />;
}
