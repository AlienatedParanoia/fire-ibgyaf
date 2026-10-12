import type { ClubRole, ClubRoleType } from "@/lib/types";

export const CLUB_ROLE_LABELS: Record<ClubRoleType, string> = {
  leader: "Leader",
  officer: "Officer Team",
  core: "Core Member",
  bod: "Board of Directors",
  member: "Member",
};

export const CLUB_ROLE_ORDER: ClubRoleType[] = ["leader", "officer", "bod", "core", "member"];

/** Group a club's team by role, in display order, skipping empty groups. */
export function groupTeam(team: ClubRole[]): { role: ClubRoleType; people: ClubRole[] }[] {
  return CLUB_ROLE_ORDER.map((role) => ({
    role,
    people: team.filter((t) => t.role === role).sort((a, b) => a.display_name.localeCompare(b.display_name)),
  })).filter((g) => g.people.length > 0);
}
