import { ClubMembersDialog } from 'fire-platform';

const club = {
  id: 'c0ffee00-3333-4c4d-9e5f-2c3d4e5f6a7b',
  name: 'Robotics & AI Society',
  description: 'Building autonomous robots for national competitions.',
  category: 'Tech',
  meeting_schedule: 'Wednesdays, 4–6pm',
  contact_email: 'robotics@hci.edu.sg',
  contact_person: 'Arjun Nair',
  logo_url: null,
  banner_url: null,
  leader_id: 'b2e4d3f1-2222-4b3c-8d4e-1b2c3d4e5f6a',
  is_approved: true,
  member_count: 0,
  created_at: '2025-02-18T08:00:00.000Z',
};

const users = [
  {
    id: 'a1f3c2e0-1111-4a2b-9c3d-0a1b2c3d4e5f',
    email: 'mei.tan@rafflesgirls.edu.sg',
    full_name: 'Mei Tan',
    school: "Raffles Girls' School",
    grade: 'Secondary 3',
    role: 'student',
    avatar_url: null,
    is_portfolio_public: true,
    interests: ['STEM', 'Math'],
    email_reminders: true,
    created_at: '2025-01-12T09:24:00.000Z',
  },
  {
    id: 'd4a6f5b3-4444-4d5e-8f6a-3d4e5f6a7b8c',
    email: 'sophia.lim@nushigh.edu.sg',
    full_name: 'Sophia Lim',
    school: 'NUS High School',
    grade: 'Year 4',
    role: 'student',
    avatar_url: null,
    is_portfolio_public: false,
    interests: ['Science', 'Tech'],
    email_reminders: true,
    created_at: '2025-01-20T11:02:00.000Z',
  },
  {
    id: 'e5b7a6c4-5555-4e6f-9a7b-4e5f6a7b8c9d',
    email: 'daniel.wong@acsindep.edu.sg',
    full_name: 'Daniel Wong',
    school: 'Anglo-Chinese School (Independent)',
    grade: 'Secondary 4',
    role: 'student',
    avatar_url: null,
    is_portfolio_public: true,
    interests: ['Tech', 'Sports'],
    email_reminders: false,
    created_at: '2025-02-01T15:45:00.000Z',
  },
];

// Open state: admin managing a freshly created club. The "Add a member"
// picker is populated from the user list; no members registered yet.
export function Open() {
  return <ClubMembersDialog open={true} onClose={() => {}} club={club} users={users} />;
}
