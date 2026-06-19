import { Card, CardHeader, CardTitle, CardFooter, Button } from 'fire-platform';

export function SingleAction() {
  return (
    <div style={{ maxWidth: '340px' }}>
      <Card>
        <CardHeader>
          <CardTitle>Singapore Math Olympiad</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button variant="ember" size="sm">Register now</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function TwoActions() {
  return (
    <div style={{ maxWidth: '340px' }}>
      <Card>
        <CardHeader>
          <CardTitle>Debate Society</CardTitle>
        </CardHeader>
        <CardFooter style={{ justifyContent: 'space-between' } as any}>
          <Button variant="outline" size="sm">Learn more</Button>
          <Button variant="ember" size="sm">Join</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
