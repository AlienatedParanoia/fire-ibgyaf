import { AdminPanel } from 'fire-platform';

const now = new Date().toISOString();

const users: any[] = [
  { id: 'u1', email: 'alice@school.edu.sg', full_name: 'Alice Tan', school: 'Raffles Institution', grade: 'JC 2', role: 'student', avatar_url: null, is_portfolio_public: true, created_at: '2025-01-10T00:00:00Z' },
  { id: 'u2', email: 'bob@nyjc.edu.sg', full_name: 'Bob Lim', school: 'NYJC', grade: 'JC 1', role: 'club_leader', avatar_url: null, is_portfolio_public: false, created_at: '2025-01-15T00:00:00Z' },
  { id: 'u3', email: 'carol@rgs.edu.sg', full_name: 'Carol Chen', school: "RGS", grade: 'Sec 4', role: 'student', avatar_url: null, is_portfolio_public: true, created_at: '2025-02-01T00:00:00Z' },
  { id: 'u4', email: 'david@hci.edu.sg', full_name: 'David Wong', school: 'HCI', grade: 'JC 1', role: 'admin', avatar_url: null, is_portfolio_public: false, created_at: '2025-02-05T00:00:00Z' },
  { id: 'u5', email: 'emily@mgs.edu.sg', full_name: 'Emily Ng', school: 'MGS', grade: 'Sec 3', role: 'student', avatar_url: null, is_portfolio_public: true, created_at: '2025-02-10T00:00:00Z' },
];

const clubs: any[] = [
  { id: 'c1', name: 'Debate Society', description: 'Competitive debate club.', category: 'Debate', meeting_schedule: 'Thursdays 4pm', contact_email: null, contact_person: 'Ms Tan', logo_url: null, banner_url: null, leader_id: 'u2', is_approved: true, member_count: 48, created_at: '2024-01-01T00:00:00Z' },
  { id: 'c2', name: 'Robotics Club', description: 'Build robots for competitions.', category: 'Robotics', meeting_schedule: 'Wednesdays 3pm', contact_email: null, contact_person: 'Mr Lim', logo_url: null, banner_url: null, leader_id: null, is_approved: true, member_count: 32, created_at: '2024-01-02T00:00:00Z' },
  { id: 'c3', name: 'Astronomy Club', description: 'Explore the night sky.', category: 'Science', meeting_schedule: 'Saturdays 7pm', contact_email: null, contact_person: null, logo_url: null, banner_url: null, leader_id: null, is_approved: false, member_count: 0, created_at: '2025-06-01T00:00:00Z' },
];

const future30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
const competitions: any[] = [
  { id: 'p1', title: 'Singapore Mathematical Olympiad', description: null, category: 'Mathematics', organizer: 'SMS', deadline: future30, event_date: null, eligibility: null, registration_link: null, prize: null, format: 'onsite', region: 'Singapore', banner_url: null, club_id: null, submitted_by: null, is_approved: true, is_featured: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'p2', title: 'National Schools Debate Championship', description: null, category: 'Debate', organizer: 'MOE', deadline: null, event_date: null, eligibility: null, registration_link: null, prize: null, format: 'onsite', region: 'Singapore', banner_url: null, club_id: null, submitted_by: null, is_approved: true, is_featured: false, created_at: '2024-01-02T00:00:00Z' },
  { id: 'p3', title: 'NUS High Science Bowl', description: null, category: 'Science', organizer: 'NUS High', deadline: null, event_date: null, eligibility: null, registration_link: null, prize: null, format: 'onsite', region: 'Singapore', banner_url: null, club_id: null, submitted_by: 'u1', is_approved: false, is_featured: false, created_at: '2025-06-01T00:00:00Z' },
];

const submissions: any[] = [
  { id: 's1', submitted_by_name: 'Alice Tan', submitted_by_email: 'alice@school.edu.sg', type: 'competition', title: 'Global Youth Writing Award', description: null, category: 'Writing', deadline: '2025-09-01', registration_link: null, organizer: 'UNESCO', eligibility: null, status: 'pending', admin_notes: null, created_at: '2025-05-20T00:00:00Z' },
  { id: 's2', submitted_by_name: 'Bob Lim', submitted_by_email: 'bob@nyjc.edu.sg', type: 'club', title: 'Philosophy Circle', description: null, category: 'Social', deadline: null, registration_link: null, organizer: null, eligibility: null, status: 'approved', admin_notes: null, created_at: '2025-05-25T00:00:00Z' },
];

const participation: any[] = [
  { id: 't1', user_id: 'u1', competition_id: 'p1', club_id: null, status: 'registered', notes: null, created_at: '2025-01-15T00:00:00Z' },
  { id: 't2', user_id: 'u3', competition_id: 'p2', club_id: null, status: 'participated', notes: null, created_at: '2025-02-01T00:00:00Z' },
  { id: 't3', user_id: 'u5', competition_id: 'p1', club_id: null, status: 'interested', notes: null, created_at: '2025-03-01T00:00:00Z' },
  { id: 't4', user_id: 'u1', competition_id: null, club_id: 'c1', status: 'registered', notes: null, created_at: '2025-01-20T00:00:00Z' },
  { id: 't5', user_id: 'u3', competition_id: null, club_id: 'c2', status: 'registered', notes: null, created_at: '2025-02-10T00:00:00Z' },
];

const analytics: any[] = [
  { event_type: 'page_view', created_at: '2025-06-19T10:00:00Z', user_id: 'u1' },
  { event_type: 'competition_saved', created_at: '2025-06-19T10:05:00Z', user_id: 'u1' },
  { event_type: 'club_joined', created_at: '2025-06-19T10:10:00Z', user_id: 'u3' },
  { event_type: 'page_view', created_at: '2025-06-18T11:00:00Z', user_id: 'u2' },
  { event_type: 'competition_saved', created_at: '2025-06-18T11:30:00Z', user_id: 'u5' },
  { event_type: 'page_view', created_at: '2025-06-17T09:00:00Z', user_id: null },
  { event_type: 'club_joined', created_at: '2025-06-17T09:15:00Z', user_id: 'u4' },
  { event_type: 'page_view', created_at: '2025-06-16T08:00:00Z', user_id: 'u1' },
  { event_type: 'competition_saved', created_at: '2025-06-16T08:30:00Z', user_id: null },
];

const data: any = { users, clubs, competitions, submissions, participation, analytics };

export function Overview() {
  return <AdminPanel data={data} />;
}
