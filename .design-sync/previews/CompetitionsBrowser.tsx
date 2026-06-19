import { CompetitionsBrowser } from 'fire-platform';

const future30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
const future60 = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10);
const future7  = new Date(Date.now() + 7  * 86400000).toISOString().slice(0, 10);

const competitions: any[] = [
  {
    id: 'p1', title: 'Singapore Mathematical Olympiad',
    description: 'The flagship maths competition for secondary and junior college students.',
    category: 'Mathematics', organizer: 'Singapore Mathematical Society', deadline: future7,
    event_date: future30, eligibility: 'Sec 1–JC 2', registration_link: 'https://example.com',
    prize: 'Gold, Silver, Bronze medals + scholarship', format: 'onsite', region: 'Singapore',
    banner_url: null, club_id: null, submitted_by: null,
    is_approved: true, is_featured: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'p2', title: 'National Schools Debate Championship',
    description: 'Inter-school debate competition run annually by MOE.',
    category: 'Debate', organizer: 'Ministry of Education', deadline: future30,
    event_date: future60, eligibility: 'Secondary school students', registration_link: 'https://example.com',
    prize: 'Trophy + certificates', format: 'onsite', region: 'Singapore',
    banner_url: null, club_id: null, submitted_by: null,
    is_approved: true, is_featured: false, created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'p3', title: 'SG Science Fair',
    description: 'Showcase your research project and compete for funding to continue your work.',
    category: 'Science', organizer: 'Agency for Science', deadline: future60,
    event_date: null, eligibility: 'Sec 3–JC 2', registration_link: 'https://example.com',
    prize: 'Up to $5,000 grant', format: 'hybrid', region: 'Singapore',
    banner_url: null, club_id: null, submitted_by: null,
    is_approved: true, is_featured: false, created_at: '2024-01-03T00:00:00Z',
  },
  {
    id: 'p4', title: 'International Robotics Olympiad',
    description: 'Build a robot that can autonomously navigate a maze and complete tasks.',
    category: 'Robotics', organizer: 'IFR Foundation', deadline: future30,
    event_date: future60, eligibility: 'Open to all', registration_link: 'https://example.com',
    prize: 'Trophy + international recognition', format: 'online', region: 'Global',
    banner_url: null, club_id: null, submitted_by: null,
    is_approved: true, is_featured: true, created_at: '2024-01-04T00:00:00Z',
  },
];

export function WithCompetitions() {
  return (
    <CompetitionsBrowser
      initialCompetitions={competitions}
      initialSavedIds={['p1']}
      loggedIn={true}
    />
  );
}

export function LoggedOut() {
  return (
    <CompetitionsBrowser
      initialCompetitions={competitions}
      initialSavedIds={[]}
      loggedIn={false}
    />
  );
}

export function Empty() {
  return (
    <CompetitionsBrowser
      initialCompetitions={[]}
      initialSavedIds={[]}
      loggedIn={false}
    />
  );
}
