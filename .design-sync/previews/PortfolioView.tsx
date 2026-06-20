import { PortfolioView } from 'fire-platform';

const activities: any[] = [
  {
    id: '1', user_id: 'u1',
    title: 'National Schools Debate Championship',
    description: 'Represented school in regional quarterfinals, debating on AI governance policy.',
    date: '2025-03-15', category: 'Debate',
    notes: 'Won best speaker award in preliminary rounds.',
    image_url: null, created_at: '2025-03-20T00:00:00Z',
  },
  {
    id: '2', user_id: 'u1',
    title: 'SG Science Fair — 2nd Place',
    description: 'Built a solar water purifier prototype from recycled materials.',
    date: '2025-01-22', category: 'Science',
    notes: null, image_url: null, created_at: '2025-01-30T00:00:00Z',
  },
  {
    id: '3', user_id: 'u1',
    title: 'Singapore Mathematical Olympiad',
    description: 'Achieved Silver award in the open division.',
    date: '2024-10-10', category: 'Mathematics',
    notes: null, image_url: null, created_at: '2024-10-15T00:00:00Z',
  },
];

export function PublicView() {
  return <PortfolioView userId="u1" initialActivities={activities} initialPublic={true} />;
}

export function PrivateView() {
  return <PortfolioView userId="u1" initialActivities={activities} initialPublic={false} />;
}

export function EmptyPortfolio() {
  return <PortfolioView userId="u1" initialActivities={[]} initialPublic={false} />;
}
