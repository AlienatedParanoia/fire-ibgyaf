import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-10">
      <Skeleton className="mb-2 h-9 w-44" />
      <Skeleton className="mb-8 h-5 w-96 max-w-full" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}
