import { ClubLeaderDashboard } from 'fire-platform';

const club: any = {
  id: 'c1', name: 'Debate Society',
  description: 'Sharpen your argumentation and public speaking skills through competitive debate.',
  category: 'Debate', meeting_schedule: 'Thursdays 4pm',
  contact_email: 'debate@school.edu.sg', contact_person: 'Ms Tan',
  logo_url: null, banner_url: null, leader_id: 'u2',
  is_approved: true, member_count: 48, created_at: '2024-01-01T00:00:00Z',
};

const competitions: any[] = [
  {
    id: 'p1', title: 'National Debate Championship',
    description: 'Annual interschool debate.', category: 'Debate',
    organizer: 'MOE', deadline: '2025-09-01', event_date: '2025-10-15',
    eligibility: 'Secondary', registration_link: 'https://example.com',
    prize: 'Trophy', format: 'onsite', region: 'Singapore',
    banner_url: null, club_id: 'c1', submitted_by: 'u2',
    is_approved: true, is_featured: false, created_at: '2024-06-01T00:00:00Z',
  },
];

const members: any[] = [
  {
    id: 'u3', email: 'alice@school.edu.sg', full_name: 'Alice Tan',
    school: 'Raffles Institution', grade: 'JC 2', role: 'student',
    avatar_url: null, is_portfolio_public: true, created_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 'u4', email: 'bob@school.edu.sg', full_name: 'Bob Lim',
    school: 'Raffles Institution', grade: 'JC 1', role: 'student',
    avatar_url: null, is_portfolio_public: false, created_at: '2025-02-01T00:00:00Z',
  },
  {
    id: 'u5', email: 'carol@school.edu.sg', full_name: 'Carol Chen',
    school: 'Raffles Institution', grade: 'Sec 4', role: 'student',
    avatar_url: null, is_portfolio_public: true, created_at: '2025-02-15T00:00:00Z',
  },
];

export function WithClub() {
  return (
    <ClubLeaderDashboard
      userId="u2"
      initialClub={club}
      initialComps={competitions}
      members={members}
    />
  );
}

export function NoClub() {
  return (
    <ClubLeaderDashboard
      userId="u2"
      initialClub={null}
      initialComps={[]}
      members={[]}
    />
  );
}
