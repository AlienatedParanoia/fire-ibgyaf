import { DownloadResumeButton } from 'fire-platform';

const profile = {
  full_name: 'Tan Wei Jie',
  school: 'Raffles Institution',
  grade: 'Secondary 3',
};

const achievements: any[] = [
  {
    id: 'a1', user_id: 'u1', competition_id: 'p1', club_id: null,
    status: 'won', notes: null, created_at: '2025-03-01T00:00:00Z',
    competitions: {
      id: 'p1', title: 'Singapore Mathematical Olympiad',
      description: null, category: 'Mathematics', organizer: 'SMS',
      deadline: null, event_date: null, eligibility: null,
      registration_link: null, prize: 'Gold medal', format: 'onsite',
      region: 'Singapore', banner_url: null, club_id: null, submitted_by: null,
      is_approved: true, is_featured: true, created_at: '2024-01-01T00:00:00Z',
    },
  },
  {
    id: 'a2', user_id: 'u1', competition_id: 'p2', club_id: null,
    status: 'participated', notes: null, created_at: '2025-02-01T00:00:00Z',
    competitions: {
      id: 'p2', title: 'National Schools Debate Championship',
      description: null, category: 'Debate', organizer: 'MOE',
      deadline: null, event_date: null, eligibility: null,
      registration_link: null, prize: null, format: 'onsite',
      region: 'Singapore', banner_url: null, club_id: null, submitted_by: null,
      is_approved: true, is_featured: false, created_at: '2024-01-02T00:00:00Z',
    },
  },
];

const activities: any[] = [
  {
    id: 'c1', user_id: 'u1',
    title: 'SG Science Fair — 2nd Place',
    description: 'Built a solar water purifier prototype from recycled materials.',
    date: '2025-01-22', category: 'Science', notes: null,
    image_url: null, created_at: '2025-01-30T00:00:00Z',
  },
  {
    id: 'c2', user_id: 'u1',
    title: 'Student Council Vice-President',
    description: 'Led the welfare committee across two academic terms.',
    date: '2024-08-01', category: 'Leadership', notes: null,
    image_url: null, created_at: '2024-08-05T00:00:00Z',
  },
];

export function Default() {
  return (
    <DownloadResumeButton profile={profile} achievements={achievements} activities={activities} />
  );
}

export function InPortfolioHeader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        maxWidth: '560px',
        padding: '20px 24px',
        borderRadius: '16px',
        border: '1px solid rgba(33,30,24,0.10)',
        background: '#FAF8F5',
      }}
    >
      <div>
        <p className="font-heading text-xl font-semibold text-ink">Tan Wei Jie</p>
        <p className="text-sm text-ink-soft">Raffles Institution · Secondary 3</p>
      </div>
      <DownloadResumeButton profile={profile} achievements={achievements} activities={activities} />
    </div>
  );
}
