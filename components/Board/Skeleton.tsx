import CardSkeleton from "../UserCard/Skeleton";
export default function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      <ColumnSkeleton hasCards={true} />

      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
    </div>
  );
}

function ColumnSkeleton({
  hasCards = false,
}: {
  hasCards?: boolean;
  isHighlighted?: boolean;
}) {
  return (
    <div className={`bg-gray-50"} w-80 flex-shrink-0 rounded-lg`}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-20 rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="space-y-3 p-2">
        {hasCards ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <div className="h-screen w-full rounded-lg border-2 border-gray-200"></div>
        )}
      </div>
    </div>
  );
}
