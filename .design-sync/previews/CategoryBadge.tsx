import { CategoryBadge } from 'fire-platform';

export function Mathematics() {
  return <CategoryBadge category="Mathematics" />;
}

export function Debate() {
  return <CategoryBadge category="Debate" />;
}

export function Science() {
  return <CategoryBadge category="Science" />;
}

export function AllCategories() {
  const cats = ['Mathematics', 'Science', 'Debate', 'Arts', 'Robotics', 'Writing', 'Social'];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {cats.map((c) => <CategoryBadge key={c} category={c} />)}
    </div>
  );
}

export function Null() {
  return (
    <span className="text-sm text-muted-foreground">
      (returns null when category is null — no element rendered)
    </span>
  );
}
