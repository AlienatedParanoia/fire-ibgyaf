import { UsersSection } from 'fire-platform';

const users: any[] = [
  {
    id: 'u1', email: 'alice@school.edu.sg', full_name: 'Alice Tan',
    school: 'Raffles Institution', grade: 'JC 2', role: 'student',
    avatar_url: null, is_portfolio_public: true, created_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 'u2', email: 'bob@nyjc.edu.sg', full_name: 'Bob Lim',
    school: 'Nanyang Junior College', grade: 'JC 1', role: 'club_leader',
    avatar_url: null, is_portfolio_public: false, created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'u3', email: 'carol@rgs.edu.sg', full_name: 'Carol Chen',
    school: "Raffles Girls' School", grade: 'Sec 4', role: 'student',
    avatar_url: null, is_portfolio_public: true, created_at: '2025-02-01T00:00:00Z',
  },
  {
    id: 'u4', email: 'david@hci.edu.sg', full_name: 'David Wong',
    school: 'Hwa Chong Institution', grade: 'JC 1', role: 'admin',
    avatar_url: null, is_portfolio_public: false, created_at: '2025-02-05T00:00:00Z',
  },
  {
    id: 'u5', email: 'emily@mgs.edu.sg', full_name: 'Emily Ng',
    school: 'Methodist Girls School', grade: 'Sec 3', role: 'student',
    avatar_url: null, is_portfolio_public: true, created_at: '2025-02-10T00:00:00Z',
  },
];

export function Default() {
  return <UsersSection users={users} />;
}

export function Empty() {
  return <UsersSection users={[]} />;
}
