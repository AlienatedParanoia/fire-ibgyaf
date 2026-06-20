import { TrackerView } from 'fire-platform';

const participation: any[] = [
  {
    id: 't1', user_id: 'u1', competition_id: 'p1', club_id: null,
    status: 'registered', notes: 'Need to revise chapters 3-5 before the event.',
    created_at: '2025-01-15T00:00:00Z',
    competitions: {
      id: 'p1', title: 'Singapore Mathematical Olympiad',
      description: null, category: 'Mathematics', organizer: 'SMS',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      event_date: null, eligibility: null, registration_link: null,
      prize: 'Gold medal', format: 'onsite', region: 'Singapore',
      banner_url: null, club_id: null, submitted_by: null,
      is_approved: true, is_featured: true, created_at: '2024-01-01T00:00:00Z',
    },
  },
  {
    id: 't2', user_id: 'u1', competition_id: 'p2', club_id: null,
    status: 'participated', notes: null,
    created_at: '2025-02-01T00:00:00Z',
    competitions: {
      id: 'p2', title: 'National Schools Debate Championship',
      description: null, category: 'Debate', organizer: 'MOE',
      deadline: null, event_date: null, eligibility: null,
      registration_link: null, prize: 'Trophy', format: 'onsite', region: 'Singapore',
      banner_url: null, club_id: null, submitted_by: null,
      is_approved: true, is_featured: false, created_at: '2024-01-02T00:00:00Z',
    },
  },
  {
    id: 't3', user_id: 'u1', competition_id: 'p3', club_id: null,
    status: 'won', notes: 'Got 2nd place overall.',
    created_at: '2025-03-01T00:00:00Z',
    competitions: {
      id: 'p3', title: 'SG Science Fair',
      description: null, category: 'Science', organizer: 'A*STAR',
      deadline: null, event_date: null, eligibility: null,
      registration_link: null, prize: '$5,000 grant', format: 'hybrid', region: 'Singapore',
      banner_url: null, club_id: null, submitted_by: null,
      is_approved: true, is_featured: false, created_at: '2024-01-03T00:00:00Z',
    },
  },
  {
    id: 't4', user_id: 'u1', competition_id: 'p4', club_id: null,
    status: 'interested', notes: null,
    created_at: '2025-04-01T00:00:00Z',
    competitions: {
      id: 'p4', title: 'International Robotics Olympiad',
      description: null, category: 'Robotics', organizer: 'IFR',
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      event_date: null, eligibility: null, registration_link: null,
      prize: 'Trophy', format: 'online', region: 'Global',
      banner_url: null, club_id: null, submitted_by: null,
      is_approved: true, is_featured: true, created_at: '2024-01-04T00:00:00Z',
    },
  },
];

export function WithParticipation() {
  return <TrackerView userId="u1" initialParticipation={participation} />;
}

export function Empty() {
  return <TrackerView userId="u1" initialParticipation={[]} />;
}
