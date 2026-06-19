import { SubmissionsSection } from 'fire-platform';

const submissions: any[] = [
  {
    id: 's1', submitted_by_name: 'Alice Tan', submitted_by_email: 'alice@school.edu.sg',
    type: 'competition', title: 'NUS High Science Bowl',
    description: 'Annual science bowl for secondary and JC students.',
    category: 'Science', deadline: '2025-08-01',
    registration_link: 'https://example.com', organizer: 'NUS High School',
    eligibility: 'Sec 1–JC 2', status: 'pending', admin_notes: null,
    created_at: '2025-06-01T00:00:00Z',
  },
  {
    id: 's2', submitted_by_name: 'Bob Lim', submitted_by_email: 'bob@nyjc.edu.sg',
    type: 'club', title: 'Philosophy Circle',
    description: 'Weekly discussions on ethics, logic, and metaphysics.',
    category: 'Social', deadline: null,
    registration_link: null, organizer: null,
    eligibility: null, status: 'pending', admin_notes: null,
    created_at: '2025-06-03T00:00:00Z',
  },
  {
    id: 's3', submitted_by_name: 'Carol Chen', submitted_by_email: 'carol@rgs.edu.sg',
    type: 'competition', title: 'Global Youth Writing Award',
    description: 'Short story competition for students aged 13-18.',
    category: 'Writing', deadline: '2025-09-01',
    registration_link: 'https://example.com', organizer: 'UNESCO',
    eligibility: 'Ages 13-18', status: 'approved', admin_notes: 'Great submission!',
    created_at: '2025-05-20T00:00:00Z',
  },
];

export function Default() {
  return <SubmissionsSection submissions={submissions} />;
}

export function Empty() {
  return <SubmissionsSection submissions={[]} />;
}
