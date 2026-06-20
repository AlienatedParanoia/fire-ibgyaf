import { ClubsGrid } from 'fire-platform';

const clubs: any[] = [
  {
    id: 'c1', name: 'Debate Society',
    description: 'Sharpen your argumentation and public speaking skills through competitive debate.',
    category: 'Debate', meeting_schedule: 'Thursdays 4pm', contact_email: null,
    contact_person: 'Ms Tan', logo_url: null, banner_url: null, leader_id: null,
    is_approved: true, member_count: 48, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'c2', name: 'Robotics Club',
    description: 'Build and program robots for national and international competitions.',
    category: 'Robotics', meeting_schedule: 'Wednesdays 3pm', contact_email: null,
    contact_person: 'Mr Lim', logo_url: null, banner_url: null, leader_id: null,
    is_approved: true, member_count: 32, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'c3', name: 'Mathematics Society',
    description: 'Explore advanced mathematical concepts and prepare for olympiad competitions.',
    category: 'Mathematics', meeting_schedule: 'Fridays 2pm', contact_email: null,
    contact_person: null, logo_url: null, banner_url: null, leader_id: null,
    is_approved: true, member_count: 65, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'c4', name: 'Creative Writing Club',
    description: 'Develop your voice through poetry, fiction, and creative non-fiction workshops.',
    category: 'Writing', meeting_schedule: 'Tuesdays 4pm', contact_email: null,
    contact_person: null, logo_url: null, banner_url: null, leader_id: null,
    is_approved: true, member_count: 24, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'c5', name: 'Environmental Science Club',
    description: 'Conduct environmental research and advocate for sustainability on campus.',
    category: 'Science', meeting_schedule: 'Mondays 3.30pm', contact_email: null,
    contact_person: null, logo_url: null, banner_url: null, leader_id: null,
    is_approved: true, member_count: 19, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'c6', name: 'Art & Design Society',
    description: 'Express yourself through digital and traditional art, illustration, and design.',
    category: 'Arts', meeting_schedule: 'Thursdays 3pm', contact_email: null,
    contact_person: null, logo_url: null, banner_url: null, leader_id: null,
    is_approved: true, member_count: 38, created_at: '2024-01-01T00:00:00Z',
  },
];

export function WithClubs() {
  return <ClubsGrid clubs={clubs} />;
}

export function Empty() {
  return <ClubsGrid clubs={[]} />;
}
