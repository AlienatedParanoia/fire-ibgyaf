import { Skeleton } from 'fire-platform';

export function TextLines() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
      <Skeleton style={{ height: '20px', width: '60%' }} />
      <Skeleton style={{ height: '16px', width: '100%' }} />
      <Skeleton style={{ height: '16px', width: '85%' }} />
    </div>
  );
}

export function AvatarRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '320px' }}>
      <Skeleton style={{ height: '40px', width: '40px', borderRadius: '9999px', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton style={{ height: '16px', width: '50%' }} />
        <Skeleton style={{ height: '14px', width: '75%' }} />
      </div>
    </div>
  );
}

export function Tags() {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Skeleton style={{ height: '24px', width: '64px', borderRadius: '9999px' }} />
      <Skeleton style={{ height: '24px', width: '80px', borderRadius: '9999px' }} />
      <Skeleton style={{ height: '24px', width: '56px', borderRadius: '9999px' }} />
    </div>
  );
}
