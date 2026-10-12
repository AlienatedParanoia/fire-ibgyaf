export type UserRole = "student" | "club_leader" | "admin";
export type CompFormat = "online" | "onsite" | "hybrid";
export type CompRegion = "Singapore" | "Global" | "Both";
export type ParticipationStatus = "interested" | "registered" | "participated" | "won";
export type CalendarEventType = "competition" | "club" | "custom";
export type SubmissionType = "competition" | "club";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface AppUser {
  id: string;
  email: string;
  full_name: string | null;
  school: string | null;
  grade: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_portfolio_public: boolean;
  interests: string[];
  email_reminders: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  tagline: string;
  contact_email: string | null;
  allow_submissions: boolean;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  meeting_schedule: string | null;
  contact_email: string | null;
  contact_person: string | null;
  logo_url: string | null;
  banner_url: string | null;
  leader_id: string | null;
  is_approved: boolean;
  member_count: number;
  created_at: string;
  // Richer profile fields (migration-lovable-clubs.sql). Optional so older rows/payloads still type-check.
  vision?: string | null;
  mission?: string | null;
  president?: string | null;
  vice_president?: string | null;
  secretary?: string | null;
  treasurer?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  website?: string | null;
  grade_requirements?: string | null;
  is_open?: boolean;
  /** Contact details are only returned to signed-in users; undefined when hidden. */
  contact_phone?: string | null;
  school?: string | null;
  tags?: string[] | null;
}

export interface Competition {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  organizer: string | null;
  deadline: string | null;
  event_date: string | null;
  eligibility: string | null;
  registration_link: string | null;
  prize: string | null;
  // Nullable in SQL — rows created by the submissions flow leave them unset.
  format: CompFormat | null;
  region: CompRegion | null;
  banner_url: string | null;
  club_id: string | null;
  submitted_by: string | null;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Participation {
  id: string;
  user_id: string;
  competition_id: string | null;
  club_id: string | null;
  status: ParticipationStatus;
  notes: string | null;
  created_at: string;
  competitions?: Competition | null;
}

export interface CustomActivity {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  date: string | null;
  category: string | null;
  notes: string | null;
  image_url: string | null;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  event_type: CalendarEventType;
  reference_id: string | null;
  date: string;
  reminder: boolean;
  created_at: string;
}

export interface CommunitySubmission {
  id: string;
  submitted_by_name: string;
  submitted_by_email: string;
  type: SubmissionType;
  title: string;
  description: string | null;
  category: string | null;
  deadline: string | null;
  registration_link: string | null;
  organizer: string | null;
  eligibility: string | null;
  status: SubmissionStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface StudentNote {
  id: string;
  user_id: string;
  author_name: string;
  author_school: string | null;
  body: string;
  status: SubmissionStatus;
  admin_notes: string | null;
  created_at: string;
}

export type AnnouncementPriority = "low" | "medium" | "high";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  status: SubmissionStatus;
  author_id: string | null;
  club_id: string | null;
  created_at: string;
}

export type FavoriteType = "club" | "competition";

export interface Favorite {
  id: string;
  user_id: string;
  item_type: FavoriteType;
  item_id: string;
  created_at: string;
}

export interface AuditEntry {
  id: string;
  actor_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface RoleRequest {
  id: string;
  user_id: string;
  requested_role: "club_leader";
  club_id: string | null;
  message: string | null;
  status: SubmissionStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export type ClubRoleType = "leader" | "officer" | "core" | "bod" | "member";

export interface ClubRole {
  id: string;
  club_id: string;
  display_name: string;
  role: ClubRoleType;
  title: string | null;
  assigned_by: string | null;
  created_at: string;
}
