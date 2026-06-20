import { PieChartCard } from 'fire-platform';

const formatData = [
  { label: 'Online', value: 58 },
  { label: 'Onsite', value: 29 },
  { label: 'Hybrid', value: 13 },
];

const statusData = [
  { label: 'Interested', value: 45 },
  { label: 'Registered', value: 32 },
  { label: 'Participated', value: 18 },
  { label: 'Won', value: 5 },
];

export function ByFormat() {
  return (
    <div style={{ maxWidth: '400px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
      <p className="mb-3 text-sm font-medium text-ink">Competitions by format</p>
      <PieChartCard data={formatData} />
    </div>
  );
}

export function ByStatus() {
  return (
    <div style={{ maxWidth: '400px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
      <p className="mb-3 text-sm font-medium text-ink">Participation breakdown</p>
      <PieChartCard data={statusData} />
    </div>
  );
}
