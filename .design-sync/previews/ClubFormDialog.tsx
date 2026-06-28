import { ClubFormDialog } from 'fire-platform';

const users: any[] = [
  { id: 'u1', email: 'rachel.koh@school.edu.sg', full_name: 'Rachel Koh', role: 'club_leader' },
  { id: 'u2', email: 'daniel.ng@school.edu.sg', full_name: 'Daniel Ng', role: 'student' },
  { id: 'u3', email: 'priya.menon@school.edu.sg', full_name: 'Priya Menon', role: 'student' },
];

const debateSociety: any = {
  id: 'club-1',
  name: 'Raffles Debate Society',
  description: 'Weekly British Parliamentary debate training, mentoring for novices, and prep for national and international circuits.',
  category: 'Debate',
  meeting_schedule: 'Wednesdays 3–5pm, Block C Seminar Room',
  contact_email: 'debate@raffles.edu.sg',
  contact_person: 'Ms Rachel Koh',
  logo_url: null,
  banner_url: null,
  leader_id: 'u1',
  is_approved: true,
  member_count: 54,
  created_at: '2024-08-01T00:00:00Z',
};

export function Edit() {
  return (
    <ClubFormDialog
      open={true}
      onClose={() => {}}
      club={debateSociety}
      onSaved={() => {}}
      users={users}
    />
  );
}

export function Create() {
  return (
    <ClubFormDialog
      open={true}
      onClose={() => {}}
      club={null}
      onSaved={() => {}}
      users={users}
    />
  );
}
