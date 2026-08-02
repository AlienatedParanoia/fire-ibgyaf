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

// PostgREST caps a response at 1000 rows regardless; stating it keeps the
// newest slice deterministic, and the totals come from real counts instead.
const ROW_LIMIT = 1000;

export interface AdminData {
  users: AppUser[];
  clubs: Club[];
  competitions: Competition[];
  submissions: CommunitySubmission[];
  participation: Participation[];
  analytics: { id: string; event_type: string; created_at: string; user_id: string | null }[];
  counts: {
    users: number;
    clubs: number;
    competitions: number;
    participation: number;
    pendingCompetitions: number;
    pendingClubs: number;
    pendingSubmissions: number;
  };
}

export default async function AdminPage() {
  const { supabase } = await requireUser(["admin"]);

  const [
    usersRes,
    clubsRes,
    compsRes,
    subsRes,
    partRes,
    anRes,
    userCount,
    clubCount,
    compCount,
    partCount,
    pendingCompCount,
    pendingClubCount,
    pendingSubCount,
  ] = await Promise.all([
    supabase.from("users").select("*").order("created_at", { ascending: false }).limit(ROW_LIMIT),
    supabase.from("clubs").select("*").order("created_at", { ascending: false }).limit(ROW_LIMIT),
    supabase
      .from("competitions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(ROW_LIMIT),
    supabase
      .from("community_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(ROW_LIMIT),
    supabase
      .from("participation")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(ROW_LIMIT),
    supabase
      .from("analytics_events")
      .select("id, event_type, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(2000),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("clubs").select("id", { count: "exact", head: true }),
    supabase.from("competitions").select("id", { count: "exact", head: true }),
    supabase.from("participation").select("id", { count: "exact", head: true }),
    supabase
      .from("competitions")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", false),
    supabase.from("clubs").select("id", { count: "exact", head: true }).eq("is_approved", false),
    supabase
      .from("community_submissions")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const data: AdminData = {
    users: (usersRes.data ?? []) as AppUser[],
    clubs: (clubsRes.data ?? []) as Club[],
    competitions: (compsRes.data ?? []) as Competition[],
    submissions: (subsRes.data ?? []) as CommunitySubmission[],
    participation: (partRes.data ?? []) as Participation[],
    analytics: (anRes.data ?? []) as AdminData["analytics"],
    counts: {
      users: userCount.count ?? 0,
      clubs: clubCount.count ?? 0,
      competitions: compCount.count ?? 0,
      participation: partCount.count ?? 0,
      pendingCompetitions: pendingCompCount.count ?? 0,
      pendingClubs: pendingClubCount.count ?? 0,
      pendingSubmissions: pendingSubCount.count ?? 0,
    },
  };

  return <AdminPanel data={data} />;
}
