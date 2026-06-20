import { Textarea, Label } from 'fire-platform';

export function Default() {
  return (
    <Textarea
      placeholder="Describe the competition, eligibility, and prizes…"
      style={{ maxWidth: '380px' }}
    />
  );
}

export function WithLabel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '380px' }}>
      <Label htmlFor="desc">Description</Label>
      <Textarea
        id="desc"
        placeholder="Describe the opportunity in a few sentences."
        rows={4}
      />
    </div>
  );
}

export function WithValue() {
  return (
    <Textarea
      defaultValue="The Singapore Mathematical Olympiad (SMO) is the largest mathematics competition in Singapore, attracting over 15,000 participants annually."
      style={{ maxWidth: '380px' }}
      rows={4}
    />
  );
}

export function Disabled() {
  return (
    <Textarea
      placeholder="Read-only field"
      disabled
      style={{ maxWidth: '380px' }}
    />
  );
}
