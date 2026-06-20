import { ChartLegend, PieChartCard } from 'fire-platform';

const formatData = [
  { label: 'Online', value: 58 },
  { label: 'Onsite', value: 29 },
  { label: 'Hybrid', value: 13 },
];

const categoryData = [
  { label: 'Mathematics', value: 34 },
  { label: 'Science', value: 28 },
  { label: 'Debate', value: 19 },
  { label: 'Arts', value: 14 },
  { label: 'Robotics', value: 22 },
];

export function WithPie() {
  return (
    <div style={{ maxWidth: '380px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
      <p className="mb-3 text-sm font-medium text-ink">Competitions by format</p>
      <PieChartCard data={formatData} />
      <ChartLegend data={formatData} />
    </div>
  );
}

export function StandaloneList() {
  return (
    <div style={{ maxWidth: '380px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
      <ChartLegend data={categoryData} />
    </div>
  );
}
