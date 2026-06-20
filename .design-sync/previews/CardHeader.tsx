import { Card, CardHeader, CardTitle, CardDescription } from 'fire-platform';

export function Default() {
  return (
    <div style={{ maxWidth: '340px' }}>
      <Card>
        <CardHeader>
          <CardTitle>Singapore Math Olympiad</CardTitle>
          <CardDescription>Open to all secondary school students in Singapore.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export function TitleOnly() {
  return (
    <div style={{ maxWidth: '340px' }}>
      <Card>
        <CardHeader>
          <CardTitle>Debate Society</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
