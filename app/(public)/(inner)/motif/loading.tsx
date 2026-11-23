import { Skeleton } from '@/components/ui/skeleton';

export default function MotifLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14 sm:px-8 space-y-8">
      {/* Header Skeleton */}
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 w-3/4 rounded-xl" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>

      {/* Filter Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-11 w-full max-w-md rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-[20px] border border-[#E8D8C8]/60 bg-white overflow-hidden shadow-xs p-3 space-y-3 dark:bg-[#2A1415]"
          >
            <Skeleton className="aspect-[4/5] w-full rounded-[14px]" />
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
