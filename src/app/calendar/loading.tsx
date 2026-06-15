import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-10">
      <Skeleton className="mb-2 h-9 w-40" />
      <Skeleton className="mb-8 h-5 w-96 max-w-full" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Skeleton className="h-[520px] rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
