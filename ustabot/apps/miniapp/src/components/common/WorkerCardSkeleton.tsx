import { Skeleton } from "@/components/ui/skeleton.js";

export function WorkerCardSkeleton(): JSX.Element {
  return (
    <div className="flex gap-3 rounded-md bg-section-bg p-3 shadow-soft">
      <Skeleton className="h-20 w-20 shrink-0 rounded-md" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function WorkerListSkeleton({ count = 5 }: { count?: number }): JSX.Element {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <WorkerCardSkeleton key={i} />
      ))}
    </div>
  );
}
