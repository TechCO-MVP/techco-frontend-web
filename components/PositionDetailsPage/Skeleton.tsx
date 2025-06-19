import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Logo skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-12 w-32 bg-gray-300" />
        </div>

        {/* Location info skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-4 w-80 bg-gray-300" />
        </div>

        {/* Main heading skeleton */}
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-12 w-full max-w-lg bg-gray-300" />
        </div>

        {/* Personalized message skeleton */}
        <div className="text-center">
          <Skeleton className="mx-auto h-6 w-full max-w-xl bg-gray-300" />
        </div>

        {/* Description paragraph skeleton */}
        <div className="space-y-3 text-center">
          <Skeleton className="h-4 w-full bg-gray-300" />
          <Skeleton className="h-4 w-full bg-gray-300" />
          <Skeleton className="h-4 w-full bg-gray-300" />
          <Skeleton className="mx-auto h-4 w-3/4 bg-gray-300" />
        </div>

        {/* Primary button skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-12 w-64 rounded-md bg-gray-300" />
        </div>

        {/* Response time text skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-4 w-56 bg-gray-300" />
        </div>

        {/* Secondary button skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-12 w-48 rounded-md bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
