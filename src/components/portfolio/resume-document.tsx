"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { CustomActivity, Participation } from "@/lib/types";

export type ResumeProfile = {
  full_name: string | null;
  school: string | null;
  grade: string | null;
};

/**
 * Button that renders a print-optimised "achievement resume" into a portal and
 * triggers the browser's native "Save as PDF" via window.print(). The resume is
 * hidden on screen and only shown by the @media print rules in globals.css.
 */
export function DownloadResumeButton({
  profile,
  achievements,
  activities,
}: {
  profile: ResumeProfile;
  achievements: Participation[];
  activities: CustomActivity[];
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <FileDown className="h-4 w-4" /> Download PDF
      </Button>
      {mounted &&
        createPortal(
          <div className="print-root hidden">
            <ResumeDocument profile={profile} achievements={achievements} activities={activities} />
          </div>,
          document.body
        )}
    </>
  );
}

function ResumeDocument({
  profile,
  achievements,
  activities,
}: {
  profile: ResumeProfile;
  achievements: Participation[];
  activities: CustomActivity[];
}) {
  const wins = achievements.filter((a) => a.status === "won");
  const participated = achievements.filter((a) => a.status === "participated");

  // Group activities by category for a clean resume layout.
  const byCategory = new Map<string, CustomActivity[]>();
  for (const a of activities) {
    const key = a.category || "Other";
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(a);
  }

  const totalAchievements = wins.length + participated.length + activities.length;

  return (
    <div className="resume mx-auto max-w-[760px] bg-white p-10 text-[#111] print:p-0">
      {/* header */}
      <header className="border-b-2 border-[#111] pb-4">
        <h1 className="font-heading text-3xl font-semibold">{profile.full_name || "Student"}</h1>
        <p className="mt-1 text-sm text-[#444]">
          {[profile.school, profile.grade].filter(Boolean).join(" · ") || "Student portfolio"}
        </p>
        <p className="mt-1 text-xs text-[#666]">
          Achievement resume · {totalAchievements} highlight{totalAchievements === 1 ? "" : "s"} ·
          Generated via F.I.R.E
        </p>
      </header>

      {/* competition achievements */}
      {(wins.length > 0 || participated.length > 0) && (
        <section className="mt-6">
          <h2 className="font-heading text-lg font-semibold uppercase tracking-wide text-[#111]">
            Competitions
          </h2>
          <ul className="mt-2 space-y-2">
            {[...wins, ...participated].map((p) => (
              <li key={p.id} className="flex items-baseline justify-between gap-4">
                <div>
                  <span className="font-medium">{p.competitions?.title ?? "Competition"}</span>
                  {p.competitions?.organizer && (
                    <span className="text-sm text-[#555]"> — {p.competitions.organizer}</span>
                  )}
                </div>
                <span className="shrink-0 text-sm font-semibold">
                  {p.status === "won" ? "🏆 Won" : "Participated"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* activities grouped by category */}
      {activities.length > 0 && (
        <section className="mt-6">
          <h2 className="font-heading text-lg font-semibold uppercase tracking-wide text-[#111]">
            Activities &amp; Awards
          </h2>
          {Array.from(byCategory.entries()).map(([cat, items]) => (
            <div key={cat} className="mt-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#666]">{cat}</h3>
              <ul className="mt-1 space-y-1.5">
                {items.map((a) => (
                  <li key={a.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-medium">{a.title}</span>
                      {a.date && <span className="shrink-0 text-xs text-[#666]">{formatDate(a.date)}</span>}
                    </div>
                    {a.description && <p className="text-sm text-[#444]">{a.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {totalAchievements === 0 && (
        <p className="mt-6 text-sm text-[#666]">
          No achievements yet — add activities and track competition wins to build your resume.
        </p>
      )}
    </div>
  );
}
