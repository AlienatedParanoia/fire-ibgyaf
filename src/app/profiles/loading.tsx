import { CardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-10">
      <Skeleton className="mb-3 h-9 w-56" />
      <Skeleton className="mb-8 h-5 w-96 max-w-full" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
