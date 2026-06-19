import { ClubsManage } from 'fire-platform';

const clubs: any[] = [
  {
    id: 'c1', name: 'Debate Society',
    description: 'Sharpen argumentation and public speaking skills.',
    category: 'Debate', meeting_schedule: 'Thursdays 4pm',
    contact_email: 'debate@school.edu.sg', contact_person: 'Ms Tan',
    logo_url: null, banner_url: null, leader_id: null,
    is_approved: true, member_count: 48, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'c2', name: 'Robotics Club',
    description: 'Build and program robots for competitions.',
    category: 'Robotics', meeting_schedule: 'Wednesdays 3pm',
    contact_email: null, contact_person: 'Mr Lim',
    logo_url: null, banner_url: null, leader_id: null,
    is_approved: false, member_count: 32, created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'c3', name: 'Creative Writing Club',
    description: 'Weekly writing workshops and competitions.',
    category: 'Writing', meeting_schedule: 'Tuesdays 4pm',
    contact_email: null, contact_person: null,
    logo_url: null, banner_url: null, leader_id: null,
    is_approved: true, member_count: 24, created_at: '2024-01-03T00:00:00Z',
  },
];

export function Default() {
  return <ClubsManage initial={clubs} />;
}

export function Empty() {
  return <ClubsManage initial={[]} />;
}
