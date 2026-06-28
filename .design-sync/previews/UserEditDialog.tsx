import { UserEditDialog } from 'fire-platform';

const meiTan = {
  id: 'a1f3c2e0-1111-4a2b-9c3d-0a1b2c3d4e5f',
  email: 'mei.tan@rafflesgirls.edu.sg',
  full_name: 'Mei Tan',
  school: "Raffles Girls' School",
  grade: 'Secondary 3',
  role: 'student',
  avatar_url: null,
  is_portfolio_public: true,
  interests: ['STEM', 'Math', 'Science'],
  email_reminders: true,
  created_at: '2025-01-12T09:24:00.000Z',
};

const arjunNair = {
  id: 'b2e4d3f1-2222-4b3c-8d4e-1b2c3d4e5f6a',
  email: 'arjun.nair@hci.edu.sg',
  full_name: 'Arjun Nair',
  school: 'Hwa Chong Institution',
  grade: 'Junior College 1',
  role: 'club_leader',
  avatar_url: null,
  is_portfolio_public: false,
  interests: ['Tech', 'Business', 'Debate'],
  email_reminders: false,
  created_at: '2024-08-03T14:10:00.000Z',
};

// Admin editing a student's full profile.
export function EditStudent() {
  return <UserEditDialog open={true} onClose={() => {}} user={meiTan} onSaved={() => {}} />;
}

// Same dialog for a club leader (different role + interests selected).
export function EditClubLeader() {
  return <UserEditDialog open={true} onClose={() => {}} user={arjunNair} onSaved={() => {}} />;
}
