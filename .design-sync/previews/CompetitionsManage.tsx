import { CompetitionsManage } from 'fire-platform';

const competitions: any[] = [
  {
    id: 'p1', title: 'Singapore Mathematical Olympiad',
    description: 'The flagship maths competition.', category: 'Mathematics',
    organizer: 'SMS', deadline: '2025-09-01', event_date: '2025-10-01',
    eligibility: 'Sec 1–JC 2', registration_link: 'https://example.com',
    prize: 'Gold medal', format: 'onsite', region: 'Singapore',
    banner_url: null, club_id: null, submitted_by: null,
    is_approved: true, is_featured: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'p2', title: 'National Schools Debate Championship',
    description: 'Inter-school debate.', category: 'Debate',
    organizer: 'MOE', deadline: '2025-08-15', event_date: null,
    eligibility: 'Secondary students', registration_link: null,
    prize: 'Trophy', format: 'onsite', region: 'Singapore',
    banner_url: null, club_id: null, submitted_by: null,
    is_approved: false, is_featured: false, created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'p3', title: 'International Robotics Olympiad',
    description: 'Build and race autonomous robots.', category: 'Robotics',
    organizer: 'IFR', deadline: '2025-07-30', event_date: null,
    eligibility: 'Open to all', registration_link: 'https://example.com',
    prize: 'Trophy + cash', format: 'online', region: 'Global',
    banner_url: null, club_id: null, submitted_by: null,
    is_approved: true, is_featured: false, created_at: '2024-01-03T00:00:00Z',
  },
];

export function Default() {
  return <CompetitionsManage initial={competitions} />;
}

export function Empty() {
  return <CompetitionsManage initial={[]} />;
}
