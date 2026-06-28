import { ParticipationSection } from 'fire-platform';

const users: any[] = [
  { id: 'u1', email: 'alice.tan@ri.edu.sg', full_name: 'Alice Tan', role: 'student', school: 'Raffles Institution', grade: 'JC 2', avatar_url: null, is_portfolio_public: true, interests: [], email_reminders: true, created_at: '2025-01-10T00:00:00Z' },
  { id: 'u2', email: 'bryan.lim@nyjc.edu.sg', full_name: 'Bryan Lim', role: 'student', school: 'Nanyang Junior College', grade: 'JC 1', avatar_url: null, is_portfolio_public: false, interests: [], email_reminders: true, created_at: '2025-01-15T00:00:00Z' },
  { id: 'u3', email: 'cheryl.ng@rgs.edu.sg', full_name: 'Cheryl Ng', role: 'student', school: "Raffles Girls' School", grade: 'Sec 4', avatar_url: null, is_portfolio_public: true, interests: [], email_reminders: false, created_at: '2025-02-01T00:00:00Z' },
  { id: 'u4', email: 'darren.wong@hci.edu.sg', full_name: 'Darren Wong', role: 'student', school: 'Hwa Chong Institution', grade: 'JC 1', avatar_url: null, is_portfolio_public: false, interests: [], email_reminders: true, created_at: '2025-02-05T00:00:00Z' },
  { id: 'u5', email: 'emma.koh@acsi.edu.sg', full_name: 'Emma Koh', role: 'student', school: 'ACS (Independent)', grade: 'Sec 3', avatar_url: null, is_portfolio_public: true, interests: [], email_reminders: true, created_at: '2025-02-10T00:00:00Z' },
];

const competitions: any[] = [
  { id: 'comp1', title: 'Singapore Mathematical Olympiad', category: 'Mathematics', organizer: 'SMS', format: 'onsite', region: 'Singapore', is_approved: true, is_featured: true, created_at: '2025-03-01T00:00:00Z' },
  { id: 'comp2', title: 'National Science Challenge', category: 'Science', organizer: 'Science Centre Singapore', format: 'hybrid', region: 'Singapore', is_approved: true, is_featured: false, created_at: '2025-03-05T00:00:00Z' },
  { id: 'comp3', title: 'World Scholar’s Cup Global Round', category: 'Debate', organizer: 'WSC', format: 'online', region: 'Global', is_approved: true, is_featured: true, created_at: '2025-03-08T00:00:00Z' },
];

const clubs: any[] = [
  { id: 'club1', name: 'Robotics & Automation Club', category: 'Technology', is_approved: true, member_count: 48, created_at: '2025-01-02T00:00:00Z' },
  { id: 'club2', name: 'Debate Society', category: 'Humanities', is_approved: true, member_count: 31, created_at: '2025-01-04T00:00:00Z' },
];

const participation: any[] = [
  { id: 'p1', user_id: 'u1', competition_id: 'comp1', club_id: null, status: 'won', notes: null, created_at: '2025-04-12T00:00:00Z' },
  { id: 'p2', user_id: 'u2', competition_id: 'comp2', club_id: null, status: 'registered', notes: null, created_at: '2025-04-15T00:00:00Z' },
  { id: 'p3', user_id: 'u3', competition_id: null, club_id: 'club2', status: 'participated', notes: null, created_at: '2025-04-18T00:00:00Z' },
  { id: 'p4', user_id: 'u4', competition_id: 'comp3', club_id: null, status: 'interested', notes: null, created_at: '2025-04-20T00:00:00Z' },
  { id: 'p5', user_id: 'u5', competition_id: null, club_id: 'club1', status: 'registered', notes: null, created_at: '2025-04-22T00:00:00Z' },
  { id: 'p6', user_id: 'u1', competition_id: 'comp3', club_id: null, status: 'participated', notes: null, created_at: '2025-04-25T00:00:00Z' },
  { id: 'p7', user_id: 'u3', competition_id: 'comp1', club_id: null, status: 'interested', notes: null, created_at: '2025-04-28T00:00:00Z' },
];

export function Default() {
  return (
    <ParticipationSection
      participation={participation}
      users={users}
      competitions={competitions}
      clubs={clubs}
    />
  );
}
