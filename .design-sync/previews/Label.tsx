import { Label, Input } from 'fire-platform';

export function Standalone() {
  return <Label>Competition title</Label>;
}

export function WithInput() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '320px', gap: '4px' }}>
      <Label htmlFor="title">Competition title</Label>
      <Input id="title" placeholder="e.g. Singapore Math Olympiad" />
    </div>
  );
}

export function Required() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '320px', gap: '4px' }}>
      <Label htmlFor="email">
        Email <span style={{ color: '#FF4D00' }}>*</span>
      </Label>
      <Input id="email" type="email" placeholder="you@school.edu.sg" />
    </div>
  );
}
