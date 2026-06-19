import { FormatBadge } from 'fire-platform';

export function Online() {
  return <FormatBadge format="online" />;
}

export function Onsite() {
  return <FormatBadge format="onsite" />;
}

export function Hybrid() {
  return <FormatBadge format="hybrid" />;
}

export function AllFormats() {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <FormatBadge format="online" />
      <FormatBadge format="onsite" />
      <FormatBadge format="hybrid" />
    </div>
  );
}
