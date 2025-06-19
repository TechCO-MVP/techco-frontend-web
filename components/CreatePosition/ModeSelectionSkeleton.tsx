import { Skeleton } from "@/components/ui/skeleton";

export default function ModeSelectionSkeleton() {
  return (
    <div className="mt-8 flex w-full flex-col px-8 py-2">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <Skeleton className="h-8 w-3/4 max-w-md" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Divider */}
      <div className="my-8 border-t border-gray-200"></div>

      {/* Understanding link - right aligned */}
      <div className="mb-8 flex justify-end">
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Option cards */}
      <div className="flex justify-around">
        {/* Card 1 */}
        <div className="flex w-[305px] flex-col items-center rounded-lg border p-6">
          {/* Icon placeholder */}
          <Skeleton className="mb-4 h-12 w-12 rounded-full" />

          {/* Title */}
          <Skeleton className="mb-4 h-6 w-48" />

          {/* Description */}
          <div className="mb-6 space-y-2 text-center">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mx-auto h-4 w-5/6" />
            <Skeleton className="mx-auto h-4 w-4/5" />
            <Skeleton className="mx-auto h-4 w-3/4" />
          </div>

          {/* Button */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Card 2 */}
        <div className="flex w-[305px] flex-col items-center rounded-lg border p-6">
          {/* Icon placeholder */}
          <Skeleton className="mb-4 h-12 w-12 rounded-full" />

          {/* Title */}
          <Skeleton className="mb-4 h-6 w-48" />

          {/* Description */}
          <div className="mb-6 space-y-2 text-center">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mx-auto h-4 w-5/6" />
            <Skeleton className="mx-auto h-4 w-4/5" />
            <Skeleton className="mx-auto h-4 w-3/4" />
          </div>

          {/* Button */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
