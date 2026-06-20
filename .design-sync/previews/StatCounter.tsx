import { StatCounter } from 'fire-platform';

export function Competitions() {
  return (
    <div style={{ background: '#211E18', padding: '32px', borderRadius: '16px', display: 'inline-block' }}>
      <StatCounter value={120} label="competitions listed" />
    </div>
  );
}

export function Students() {
  return (
    <div style={{ background: '#211E18', padding: '32px', borderRadius: '16px', display: 'inline-block' }}>
      <StatCounter value={3400} label="student participants" />
    </div>
  );
}

export function WithSuffix() {
  return (
    <div style={{ background: '#211E18', padding: '32px', borderRadius: '16px', display: 'inline-block' }}>
      <StatCounter value={98} label="satisfaction rate" suffix="%" />
    </div>
  );
}

export function Row() {
  return (
    <div
      style={{
        background: '#FF4D00',
        padding: '32px',
        borderRadius: '16px',
        display: 'flex',
        gap: '48px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <StatCounter value={120} label="competitions" />
      <StatCounter value={42} label="clubs" />
      <StatCounter value={3400} label="students" />
    </div>
  );
}
