import { LineChartCard } from 'fire-platform';

const weeklyData = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 28 },
  { label: 'Fri', value: 24 },
  { label: 'Sat', value: 8 },
  { label: 'Sun', value: 6 },
];

const monthlyData = [
  { label: 'Jan', value: 45 },
  { label: 'Feb', value: 62 },
  { label: 'Mar', value: 58 },
  { label: 'Apr', value: 74 },
  { label: 'May', value: 91 },
  { label: 'Jun', value: 83 },
];

export function Weekly() {
  return (
    <div style={{ maxWidth: '500px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
      <p className="mb-3 text-sm font-medium text-ink">Signups this week</p>
      <LineChartCard data={weeklyData} />
    </div>
  );
}

export function Monthly() {
  return (
    <div style={{ maxWidth: '500px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
      <p className="mb-3 text-sm font-medium text-ink">Monthly active users</p>
      <LineChartCard data={monthlyData} />
    </div>
  );
}
