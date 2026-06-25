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
  format: CompFormat;
  region: CompRegion;
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
