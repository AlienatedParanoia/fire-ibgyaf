import { Globe, Instagram, Linkedin, GraduationCap, Building2 } from "lucide-react";
import { cn, socialUrl } from "@/lib/utils";
import type { Club } from "@/lib/types";

/** Open/closed + school + grade chips shown next to the club name. */
export function ClubChips({ club }: { club: Club }) {
  const open = club.is_open !== false;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={cn(
          "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
          open ? "bg-emerald-100 text-emerald-800" : "bg-ink/10 text-ink-faint"
        )}
      >
        {open ? "Open to join" : "Closed"}
      </span>
      {club.school && (
        <span className="flex items-center gap-1 text-[13px] text-ink-faint">
          <Building2 className="h-3.5 w-3.5" /> {club.school}
        </span>
      )}
      {club.grade_requirements && (
        <span className="flex items-center gap-1 text-[13px] text-ink-faint">
          <GraduationCap className="h-3.5 w-3.5" /> {club.grade_requirements}
        </span>
      )}
    </div>
  );
}

/** Vision, mission, leadership team and social links for a club. Renders nothing for empty fields. */
export function ClubProfile({ club }: { club: Club }) {
  const leaders = [
    ["President", club.president],
    ["Vice President", club.vice_president],
    ["Secretary", club.secretary],
    ["Treasurer", club.treasurer],
  ].filter(([, name]) => !!name) as [string, string][];

  const links = (
    [
      ["instagram", club.instagram, Instagram, "Instagram"],
      ["linkedin", club.linkedin, Linkedin, "LinkedIn"],
      ["website", club.website, Globe, "Website"],
    ] as const
  ).filter(([, v]) => !!v?.trim());

  if (!club.vision && !club.mission && leaders.length === 0 && links.length === 0) return null;

  return (
    <div className="mt-6 space-y-5">
      {(club.vision || club.mission) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {club.vision && <TextBlock label="Vision" text={club.vision} />}
          {club.mission && <TextBlock label="Mission" text={club.mission} />}
        </div>
      )}

      {leaders.length > 0 && (
        <div>
          <p className="mb-2 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">Leadership</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {leaders.map(([role, name]) => (
              <div key={role} className="rounded-[12px] border-[1.5px] border-ink/12 bg-paper p-3">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">{role}</p>
                <p className="mt-1 text-[13.5px] font-medium text-ink">{name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map(([kind, value, Icon, label]) => {
            const href = socialUrl(kind, value);
            const cls =
              "inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-ink/15 px-3.5 py-1.5 text-[13px] font-medium text-ink";
            return href ? (
              <a
                key={kind}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(cls, "transition-colors hover:bg-ink hover:text-paper")}
              >
                <Icon className="h-3.5 w-3.5" /> {kind === "website" ? label : value}
              </a>
            ) : (
              <span key={kind} className={cls}>
                <Icon className="h-3.5 w-3.5" /> {value}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TextBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-[12px] border-[1.5px] border-ink/12 bg-paper p-4">
      <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">{label}</p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
