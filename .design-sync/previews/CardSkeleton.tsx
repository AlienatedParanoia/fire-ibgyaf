import { CardSkeleton } from 'fire-platform';

export function Single() {
  return <div style={{ maxWidth: '340px' }}><CardSkeleton /></div>;
}

export function Grid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '720px' }}>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
