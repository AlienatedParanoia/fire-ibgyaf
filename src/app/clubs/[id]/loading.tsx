import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-48 w-full rounded-none sm:h-60" />
      <div className="container -mt-16 pb-16">
        <div className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-5 w-40" />
              <Skeleton className="h-8 w-64 max-w-full" />
            </div>
          </div>
          <Skeleton className="mt-6 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}
