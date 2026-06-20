import { Button } from 'fire-platform';

export function EmberPrimary() {
  return <Button variant="ember">Sign up →</Button>;
}

export function Sketch() {
  return <Button variant="sketch">Learn more</Button>;
}

export function Outline() {
  return <Button variant="outline">View clubs</Button>;
}

export function Ghost() {
  return <Button variant="ghost">Cancel</Button>;
}

export function Subtle() {
  return <Button variant="subtle">Saved</Button>;
}

export function Destructive() {
  return <Button variant="destructive">Delete account</Button>;
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="sm" variant="ember">Small</Button>
      <Button size="default" variant="ember">Default</Button>
      <Button size="lg" variant="ember">Large</Button>
    </div>
  );
}

export function Disabled() {
  return <Button disabled>Unavailable</Button>;
}
