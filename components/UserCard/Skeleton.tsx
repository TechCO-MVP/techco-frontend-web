import { MoreHorizontal } from "lucide-react";

export default function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg bg-white p-3 shadow">
      <div className="flex items-start justify-between">
        <div className={`h-5 w-48 rounded-md bg-gray-200`}></div>
        <button className="rounded p-1 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="flex gap-3">
        <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200"></div>
        <div className="w-full space-y-1.5">
          <div className="h-3 w-24 rounded bg-gray-200"></div>
          <div className="h-4 w-40 rounded bg-gray-200"></div>
          <div className="h-3 w-32 rounded bg-gray-200"></div>
          <div className="h-3 w-36 rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-4 w-20 rounded-full text-xs"></div>
        <div className="flex gap-1">
          <div className="h-5 w-5 rounded bg-gray-200"></div>
          <div className="h-5 w-5 rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-gray-200"></div>
        <div className="h-3 w-3/4 rounded bg-gray-200"></div>
      </div>

      <div className="h-16 rounded bg-gray-100 p-2">
        <div className="mb-1 h-2 w-full rounded bg-gray-200"></div>
        <div className="mb-1 h-2 w-5/6 rounded bg-gray-200"></div>
        <div className="h-2 w-4/5 rounded bg-gray-200"></div>
      </div>

      <div className="h-8 w-full rounded bg-gray-100"></div>
    </div>
  );
}
