import { Skeleton } from '@/components/ui/skeleton';

export default function KuisLoading() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 space-y-6">
      <div className="rounded-[24px] border border-[#E8D8C8]/60 bg-white p-8 sm:p-14 shadow-sm text-center space-y-4 dark:bg-[#2A1415]">
        <Skeleton className="size-16 rounded-full mx-auto" />
        <Skeleton className="h-5 w-32 rounded-full mx-auto" />
        <Skeleton className="h-10 w-3/4 rounded-xl mx-auto" />
        <Skeleton className="h-4 w-full rounded-md mx-auto" />
        <Skeleton className="h-4 w-2/3 rounded-md mx-auto" />
        <div className="pt-6">
          <Skeleton className="h-13 w-48 rounded-full mx-auto" />
        </div>
      </div>
    </div>
  );
}
