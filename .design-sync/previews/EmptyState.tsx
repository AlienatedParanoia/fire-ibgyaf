import { EmptyState } from 'fire-platform';

export function NoCompetitions() {
  return (
    <EmptyState
      title="No competitions yet"
      description="Be the first to discover competitions in this category."
    />
  );
}

export function NoClubs() {
  return (
    <EmptyState
      title="No clubs here yet"
      description="Be the first to suggest a club for this category."
      actionLabel="Suggest a club"
      actionHref="/submit"
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      title="No results found"
      description="Try adjusting your search or filters to find what you're looking for."
    />
  );
}

export function WithCallback() {
  return (
    <EmptyState
      title="Nothing tracked yet"
      description="Start tracking competitions and clubs to build your activity record."
      actionLabel="Browse competitions"
      onAction={() => {}}
    />
  );
}
