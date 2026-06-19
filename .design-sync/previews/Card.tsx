import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from 'fire-platform';

export function CompetitionCard() {
  return (
    <div style={{ maxWidth: '340px' }}>
      <Card>
        <CardHeader>
          <CardTitle>Singapore Math Olympiad</CardTitle>
          <CardDescription>Open to all secondary school students in Singapore.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink-soft">
            Compete with the best mathematical minds across the nation. Register before the deadline.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="ember" size="sm">Register now</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function ClubCard() {
  return (
    <div style={{ maxWidth: '340px' }}>
      <Card>
        <CardHeader>
          <CardTitle>Debate Society</CardTitle>
          <CardDescription>Sharpen your argumentation and public speaking skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Badge className="bg-purple-100 text-purple-700">Debate</Badge>
            <span className="text-sm text-muted-foreground">48 members · Thursdays 4pm</span>
          </div>
        </CardContent>
        <CardFooter style={{ justifyContent: 'space-between' } as any}>
          <Button variant="outline" size="sm">Learn more</Button>
          <Button variant="ember" size="sm">Join</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function MinimalCard() {
  return (
    <div style={{ maxWidth: '340px' }}>
      <Card>
        <CardContent style={{ paddingTop: '1.5rem' }}>
          <p className="text-sm text-ink">A simple card with only content — no header or footer needed.</p>
        </CardContent>
      </Card>
    </div>
  );
}
