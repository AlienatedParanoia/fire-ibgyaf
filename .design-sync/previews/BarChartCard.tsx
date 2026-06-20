import { BarChartCard } from 'fire-platform';

const categoryData = [
  { label: 'Math', value: 34 },
  { label: 'Science', value: 28 },
  { label: 'Debate', value: 19 },
  { label: 'Arts', value: 14 },
  { label: 'Robotics', value: 22 },
  { label: 'Writing', value: 11 },
];

const gradeData = [
  { label: 'Sec 1', value: 120 },
  { label: 'Sec 2', value: 98 },
  { label: 'Sec 3', value: 145 },
  { label: 'Sec 4', value: 87 },
  { label: 'JC 1', value: 63 },
  { label: 'JC 2', value: 41 },
];

export function ByCategory() {
  return (
    <div style={{ maxWidth: '500px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
      <p className="mb-3 text-sm font-medium text-ink">Competitions by category</p>
      <BarChartCard data={categoryData} color="#0066FF" />
    </div>
  );
}

export function ByGrade() {
  return (
    <div style={{ maxWidth: '500px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
      <p className="mb-3 text-sm font-medium text-ink">Students by grade</p>
      <BarChartCard data={gradeData} color="#FF4D00" />
    </div>
  );
}
