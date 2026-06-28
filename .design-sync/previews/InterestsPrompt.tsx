import { InterestsPrompt } from 'fire-platform';

// The prompt renders only while no interests are picked yet (empty array);
// once interests exist it collapses to null.

export function Default() {
  return (
    <div style={{ maxWidth: '720px' }}>
      <InterestsPrompt initialInterests={[]} />
    </div>
  );
}

export function OnDashboard() {
  return (
    <div style={{ maxWidth: '720px', padding: '24px', background: '#FAF8F5', borderRadius: '16px' }}>
      <p className="font-heading text-2xl font-semibold text-ink" style={{ marginBottom: '4px' }}>
        Welcome back, Wei Jie
      </p>
      <p className="text-sm text-ink-soft" style={{ marginBottom: '20px' }}>
        Here is what is happening across your competitions and clubs.
      </p>
      <InterestsPrompt initialInterests={[]} />
    </div>
  );
}
