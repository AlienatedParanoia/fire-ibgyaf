import { Badge } from 'fire-platform';

export function EmberBadge() {
  return <Badge className="bg-ember/10 text-ember">Featured</Badge>;
}

export function PenBadge() {
  return <Badge className="bg-pen/10 text-pen">Global</Badge>;
}

export function InkBadge() {
  return <Badge className="bg-ink/8 text-ink-soft">Online</Badge>;
}

export function GreenBadge() {
  return <Badge className="bg-emerald-100 text-emerald-700">Won</Badge>;
}

export function PurpleBadge() {
  return <Badge className="bg-purple-100 text-purple-700">Debate</Badge>;
}

export function AllVariants() {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge className="bg-ember/10 text-ember">Featured</Badge>
      <Badge className="bg-pen/10 text-pen">Global</Badge>
      <Badge className="bg-ink/8 text-ink-soft">Online</Badge>
      <Badge className="bg-emerald-100 text-emerald-700">Won</Badge>
      <Badge className="bg-amber-100 text-amber-700">Participated</Badge>
      <Badge className="bg-electric-50 text-electric-700">Registered</Badge>
      <Badge className="bg-purple-100 text-purple-700">Debate</Badge>
    </div>
  );
}
