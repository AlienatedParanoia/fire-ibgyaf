import { CardDescription } from 'fire-platform';

export function Default() {
  return (
    <div style={{ maxWidth: '320px' }}>
      <CardDescription>Open to all secondary school students in Singapore.</CardDescription>
    </div>
  );
}

export function Longer() {
  return (
    <div style={{ maxWidth: '320px' }}>
      <CardDescription>
        Compete with the best mathematical minds across the nation. Prizes include scholarships
        and recognition certificates from MOE.
      </CardDescription>
    </div>
  );
}
