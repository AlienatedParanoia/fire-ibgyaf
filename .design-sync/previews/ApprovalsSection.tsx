import { ApprovalsSection } from 'fire-platform';

const pending: any[] = [
  {
    id: 'p1', title: 'NUS High Science Bowl',
    description: 'Annual science bowl competition for secondary and JC students.',
    category: 'Science', organizer: 'NUS High School', deadline: '2025-08-01',
    event_date: '2025-09-10', eligibility: 'Sec 1–JC 2',
    registration_link: 'https://example.com', prize: 'Trophy + medals',
    format: 'onsite', region: 'Singapore', banner_url: null,
    club_id: null, submitted_by: 'u1', is_approved: false, is_featured: false,
    created_at: '2025-06-01T00:00:00Z',
  },
  {
    id: 'p2', title: 'Global Youth Debate Forum',
    description: 'International debate for high school students around the world.',
    category: 'Debate', organizer: 'GYDF Foundation', deadline: '2025-07-15',
    event_date: null, eligibility: 'Ages 15-18',
    registration_link: 'https://example.com', prize: 'Scholarship',
    format: 'online', region: 'Global', banner_url: null,
    club_id: null, submitted_by: 'u2', is_approved: false, is_featured: false,
    created_at: '2025-06-02T00:00:00Z',
  },
];

export function CompetitionApprovals() {
  return <ApprovalsSection kind="competition" competitions={pending} clubs={[]} />;
}

const pendingClubs: any[] = [
  {
    id: 'c1', name: 'Astronomy Club',
    description: 'Explore the night sky through telescopes and astrophotography.',
    category: 'Science', meeting_schedule: 'Saturdays 7pm',
    contact_email: 'astro@school.edu.sg', contact_person: 'Ms Yeo',
    logo_url: null, banner_url: null, leader_id: null,
    is_approved: false, member_count: 0, created_at: '2025-06-01T00:00:00Z',
  },
];

export function ClubApprovals() {
  return <ApprovalsSection kind="club" competitions={[]} clubs={pendingClubs} />;
}

export function EmptyQueue() {
  return <ApprovalsSection kind="competition" competitions={[]} clubs={[]} />;
}
