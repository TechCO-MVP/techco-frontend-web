import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="mx-auto w-full space-y-8 p-6">
      {/* Header Section */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4 bg-gray-300" />
        <Skeleton className="h-4 w-full bg-gray-300" />
      </div>

      {/* Company Profile Section */}
      <div className="flex items-start space-x-4">
        <Skeleton className="h-16 w-16 rounded-full bg-gray-300" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 bg-gray-300" />
          <Skeleton className="h-4 w-32 bg-gray-300" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Description Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-gray-300" />
          <Skeleton className="h-32 w-full bg-gray-300" />
        </div>

        {/* Website URL Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-gray-300" />
          <Skeleton className="h-10 w-full bg-gray-300" />
        </div>

        {/* LinkedIn Profile Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 bg-gray-300" />
          <Skeleton className="h-10 w-full bg-gray-300" />
        </div>

        {/* Submit Button */}
        <Skeleton className="h-10 w-40 bg-gray-300" />
      </div>
    </div>
  );
}
