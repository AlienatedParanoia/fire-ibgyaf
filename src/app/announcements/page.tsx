import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { getSupabasePublic } from "@/lib/supabase/public";
import { PriorityBadge } from "@/components/announcements/priority-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import type { Announcement } from "@/lib/types";

export const metadata: Metadata = { title: "Announcements — F.I.R.E" };

// Only approved rows are public, so a short ISR window is plenty fresh.
export const revalidate = 60;

type Row = Announcement & { clubs: { id: string; name: string } | null };

export default async function AnnouncementsPage() {
  const supabase = getSupabasePublic();
  let items: Row[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("announcements")
      .select("id, title, content, priority, status, author_id, club_id, created_at, clubs(id, name)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(100);
    items = (data ?? []) as unknown as Row[];
  }
  // High priority first, newest first within each priority.
  const rank = { high: 0, medium: 1, low: 2 } as const;
  items.sort((a, b) => rank[a.priority] - rank[b.priority] || +new Date(b.created_at) - +new Date(a.created_at));

  return (
    <div className="container max-w-3xl py-10">
      <header className="mb-8">
        <h1 className="font-heading text-4xl font-medium text-ink">
          Announcements<span className="text-coral">.</span>
        </h1>
        <p className="mt-2 text-[17px] text-ink-soft">News from F.I.R.E and the clubs around school.</p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-7 w-7" />}
          title="Nothing announced yet"
          description="Check back soon — club news and platform updates will show up here."
        />
      ) : (
        <ul className="space-y-4">
          {items.map((a) => (
            <li key={a.id} className="rounded-2xl border-[1.5px] border-ink/12 bg-panel p-5 shadow-hard-card">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <PriorityBadge priority={a.priority} />
                {a.clubs && (
                  <Link
                    href={`/clubs/${a.clubs.id}`}
                    className="text-[13px] font-medium text-ink-soft underline-offset-2 hover:text-ember hover:underline"
                  >
                    {a.clubs.name}
                  </Link>
                )}
                <span className="ml-auto text-xs text-ink-faint">{formatDate(a.created_at)}</span>
              </div>
              <h2 className="font-heading text-xl font-medium text-ink">{a.title}</h2>
              <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{a.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
