import { RegionBadge } from 'fire-platform';

export function Singapore() {
  return <RegionBadge region="Singapore" />;
}

export function Global() {
  return <RegionBadge region="Global" />;
}

export function Both() {
  return <RegionBadge region="Both" />;
}

export function AllRegions() {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <RegionBadge region="Singapore" />
      <RegionBadge region="Global" />
      <RegionBadge region="Both" />
    </div>
  );
}
