import { NotificationsSection } from 'fire-platform';

const users: any[] = [
  {
    id: 'u1', email: 'alice.tan@ri.edu.sg', full_name: 'Alice Tan',
    school: 'Raffles Institution', grade: 'JC 2', role: 'student',
    avatar_url: null, is_portfolio_public: true, interests: ['Science', 'Debate'],
    email_reminders: true, created_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 'u2', email: 'bryan.lim@nyjc.edu.sg', full_name: 'Bryan Lim',
    school: 'Nanyang Junior College', grade: 'JC 1', role: 'club_leader',
    avatar_url: null, is_portfolio_public: false, interests: ['Robotics'],
    email_reminders: true, created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'u3', email: 'cheryl.ng@rgs.edu.sg', full_name: 'Cheryl Ng',
    school: "Raffles Girls' School", grade: 'Sec 4', role: 'student',
    avatar_url: null, is_portfolio_public: true, interests: ['Maths', 'Coding'],
    email_reminders: false, created_at: '2025-02-01T00:00:00Z',
  },
  {
    id: 'u4', email: 'darren.wong@hci.edu.sg', full_name: 'Darren Wong',
    school: 'Hwa Chong Institution', grade: 'JC 1', role: 'student',
    avatar_url: null, is_portfolio_public: false, interests: ['Physics'],
    email_reminders: true, created_at: '2025-02-05T00:00:00Z',
  },
  {
    id: 'u5', email: 'emma.koh@acsi.edu.sg', full_name: 'Emma Koh',
    school: 'ACS (Independent)', grade: 'Sec 3', role: 'club_leader',
    avatar_url: null, is_portfolio_public: true, interests: ['Entrepreneurship'],
    email_reminders: true, created_at: '2025-02-10T00:00:00Z',
  },
  {
    id: 'u6', email: 'admin@fire.sg', full_name: 'Priya Menon',
    school: null, grade: null, role: 'admin',
    avatar_url: null, is_portfolio_public: false, interests: [],
    email_reminders: true, created_at: '2024-12-01T00:00:00Z',
  },
];

export function Default() {
  return <NotificationsSection users={users} />;
}
