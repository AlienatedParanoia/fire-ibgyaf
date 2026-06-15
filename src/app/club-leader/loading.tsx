import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-10">
      <Skeleton className="mb-2 h-9 w-52" />
      <Skeleton className="mb-8 h-5 w-96 max-w-full" />
      <Skeleton className="mb-6 h-12 w-80 max-w-full rounded-xl" />
      <Skeleton className="h-96 max-w-2xl rounded-2xl" />
    </div>
  );
}
