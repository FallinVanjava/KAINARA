import { Skeleton } from '@/components/ui/skeleton';

export default function MotifDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12 sm:px-8 space-y-10 sm:space-y-12">
      {/* Breadcrumb Skeleton */}
      <Skeleton className="h-4 w-48 rounded-full" />

      {/* Header Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5">
          <Skeleton className="aspect-[4/5] w-full rounded-[20px]" />
        </div>
        <div className="md:col-span-7 space-y-4">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-10 w-2/3 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>

      <hr className="border-t-2 border-dotted border-[#E8D8C8]/60" />

      {/* Makna & Sejarah Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>

      <hr className="border-t-2 border-dotted border-[#E8D8C8]/60" />

      {/* Skintone Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48 rounded-md" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
