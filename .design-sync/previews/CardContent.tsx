import { Card, CardContent, Badge } from 'fire-platform';

export function Text() {
  return (
    <div style={{ maxWidth: '340px' }}>
      <Card>
        <CardContent style={{ paddingTop: '1.5rem' }}>
          <p className="text-sm text-ink">
            Compete with the best mathematical minds across the nation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function Tags() {
  return (
    <div style={{ maxWidth: '340px' }}>
      <Card>
        <CardContent style={{ paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Badge className="bg-purple-100 text-purple-700">Debate</Badge>
            <Badge className="bg-ink/8 text-ink-soft">48 members</Badge>
            <Badge className="bg-pen/10 text-pen">Thursdays 4pm</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
