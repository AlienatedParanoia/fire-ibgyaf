import { ActivityCard } from 'fire-platform';

const debate: any = {
  id: '1',
  user_id: 'u1',
  title: 'National Schools Debate Championship',
  description: 'Represented school in the regional quarterfinals, debating on AI governance policy.',
  date: '2025-03-15',
  category: 'Debate',
  notes: 'Best speaker award in the preliminary rounds.',
  image_url: null,
  created_at: '2025-03-20T00:00:00Z',
};

const science: any = {
  id: '2',
  user_id: 'u1',
  title: 'SG Science Fair',
  description: 'Built a prototype solar water purifier from recycled materials.',
  date: '2025-01-22',
  category: 'Science',
  notes: null,
  image_url: null,
  created_at: '2025-01-30T00:00:00Z',
};

export function DebateCard() {
  return (
    <div style={{ maxWidth: '320px' }}>
      <ActivityCard activity={debate} />
    </div>
  );
}

export function ScienceCard() {
  return (
    <div style={{ maxWidth: '320px' }}>
      <ActivityCard activity={science} />
    </div>
  );
}

export function WithAction() {
  return (
    <div style={{ maxWidth: '320px' }}>
      <ActivityCard
        activity={debate}
        action={
          <button
            style={{
              background: 'rgba(255,77,0,0.9)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Remove
          </button>
        }
      />
    </div>
  );
}
