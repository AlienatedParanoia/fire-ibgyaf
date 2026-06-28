import { CompetitionFormDialog } from 'fire-platform';

const clubs: any[] = [
  { id: 'club-1', name: 'Raffles Debate Society' },
  { id: 'club-2', name: 'Hwa Chong Robotics Club' },
  { id: 'club-3', name: 'NUS High Math Circle' },
];

const mathOlympiad: any = {
  id: 'comp-1',
  title: 'Singapore Mathematical Olympiad 2025',
  description: 'The flagship national maths competition for secondary and JC students, with Junior, Senior and Open sections.',
  category: 'Mathematics',
  organizer: 'Singapore Mathematical Society',
  deadline: '2025-08-15',
  event_date: '2025-09-20',
  eligibility: 'Sec 1 to JC 2',
  registration_link: 'https://sms.math.nus.edu.sg/smo',
  prize: 'Gold, Silver & Bronze medals + cash awards',
  format: 'onsite',
  region: 'Singapore',
  banner_url: null,
  club_id: 'club-3',
  submitted_by: null,
  is_approved: true,
  is_featured: true,
  created_at: '2025-01-10T00:00:00Z',
};

export function Edit() {
  return (
    <CompetitionFormDialog
      open={true}
      onClose={() => {}}
      competition={mathOlympiad}
      onSaved={() => {}}
      clubs={clubs}
    />
  );
}

export function Create() {
  return (
    <CompetitionFormDialog
      open={true}
      onClose={() => {}}
      competition={null}
      onSaved={() => {}}
      clubs={clubs}
    />
  );
}
