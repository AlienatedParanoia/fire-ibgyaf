import { unstable_cache } from "next/cache";
import { getSupabasePublic } from "@/lib/supabase/public";

const clip = (s: string | null | undefined, n: number) =>
  s ? (s.length > n ? `${s.slice(0, n)}…` : s).replace(/\s+/g, " ").trim() : "";

/**
 * Plain-text snapshot of what's live on the platform, for the chatbot's system prompt.
 * Built from public, approved rows only (signed-out-readable columns — no contact
 * details) and cached for 5 minutes so chatting doesn't hit the database every turn.
 */
export const getChatContext = unstable_cache(
  async (): Promise<string> => {
    const supabase = getSupabasePublic();
    if (!supabase) return "(no live data available)";
    const today = new Date().toISOString().slice(0, 10);

    const [clubs, comps, anns] = await Promise.all([
      supabase
        .from("clubs")
        .select("name, category, description, vision, mission, president, vice_president, is_open, grade_requirements, instagram, website")
        .eq("is_approved", true)
        .order("name")
        .limit(60),
      supabase
        .from("competitions")
        .select("title, organizer, category, deadline, event_date, eligibility, region, format, prize, registration_link, description")
        .eq("is_approved", true)
        .or(`deadline.is.null,deadline.gte.${today}`)
        .order("deadline", { ascending: true, nullsFirst: false })
        .limit(40),
      supabase
        .from("announcements")
        .select("title, content, priority")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    const clubLines = (clubs.data ?? []).map((c) =>
      [
        `• ${c.name} [${c.category ?? "General"}] ${c.is_open === false ? "(closed)" : "(open)"}`,
        c.president && `President: ${c.president}`,
        c.vice_president && `VP: ${c.vice_president}`,
        c.grade_requirements && `Grades: ${c.grade_requirements}`,
        clip(c.mission ?? c.description ?? c.vision, 160) && `About: ${clip(c.mission ?? c.description ?? c.vision, 160)}`,
        c.instagram && `IG: ${c.instagram}`,
        c.website && `Web: ${c.website}`,
      ]
        .filter(Boolean)
        .join(" — ")
    );

    const compLines = (comps.data ?? []).map((k) =>
      [
        `• ${k.title}${k.organizer ? ` by ${k.organizer}` : ""} [${k.category ?? "General"}]`,
        k.deadline && `Deadline: ${k.deadline}`,
        k.event_date && `Event: ${k.event_date}`,
        k.region && `Region: ${k.region}`,
        k.format && `Format: ${k.format}`,
        k.eligibility && `Eligibility: ${clip(k.eligibility, 80)}`,
        k.prize && `Prize: ${clip(k.prize, 60)}`,
        k.registration_link && `Register: ${k.registration_link}`,
      ]
        .filter(Boolean)
        .join(" — ")
    );

    const annLines = (anns.data ?? []).map((a) => `• [${a.priority}] ${a.title} — ${clip(a.content, 140)}`);

    return [
      `CLUBS (${clubLines.length}):`,
      clubLines.join("\n") || "(none)",
      "",
      `OPEN COMPETITIONS (${compLines.length}, soonest deadline first):`,
      compLines.join("\n") || "(none)",
      "",
      `RECENT ANNOUNCEMENTS (${annLines.length}):`,
      annLines.join("\n") || "(none)",
    ].join("\n");
  },
  ["chat-context"],
  { revalidate: 300 }
);
