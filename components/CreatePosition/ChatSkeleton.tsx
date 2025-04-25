export default function LoadingSkeleton() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1000px] flex-col px-14 py-6">
      {/* Assistant message with emoji */}
      <div className="flex animate-pulse flex-col space-y-2">
        <div className="flex items-start space-x-2">
          <div className="h-6 w-6 rounded-full bg-gray-200" />{" "}
          {/* Emoji placeholder */}
          <div className="h-5 w-3/4 rounded bg-gray-200" /> {/* Title text */}
        </div>
        <div className="ml-8 h-4 rounded bg-gray-200" /> {/* First line */}
        <div className="ml-8 h-4 w-5/6 rounded bg-gray-200" />{" "}
        {/* Second line */}
      </div>

      {/* User response in gray box */}
      <div className="animate-pulse rounded-lg bg-gray-100 p-4">
        <div className="mx-auto h-5 w-2/3 rounded bg-gray-200" />
      </div>

      {/* Assistant follow-up message */}
      <div className="flex animate-pulse flex-col space-y-2">
        <div className="h-4 rounded bg-gray-200" /> {/* First line */}
        <div className="h-4 w-5/6 rounded bg-gray-200" /> {/* Second line */}
        <div className="h-4 w-4/5 rounded bg-gray-200" /> {/* Third line */}
      </div>

      {/* Example bullet point */}
      <div className="flex animate-pulse items-center space-x-2">
        <div className="h-4 w-4 rounded-full bg-gray-200" />{" "}
        {/* Bullet point */}
        <div className="h-4 w-3/4 rounded bg-gray-200" /> {/* Example text */}
      </div>

      {/* Second user response in gray box */}
      <div className="animate-pulse rounded-lg bg-gray-100 p-4">
        <div className="mx-auto h-5 w-4/5 rounded bg-gray-200" />
      </div>

      {/* Final assistant message */}
      <div className="flex animate-pulse flex-col space-y-2">
        <div className="h-4 rounded bg-gray-200" /> {/* First line */}
        <div className="h-4 w-5/6 rounded bg-gray-200" /> {/* Second line */}
        <div className="h-4 w-4/5 rounded bg-gray-200" /> {/* Third line */}
        <div className="h-4 w-3/4 rounded bg-gray-200" /> {/* Fourth line */}
      </div>

      <div className="flex animate-pulse flex-col space-y-2">
        <div className="h-4 rounded bg-gray-200" /> {/* First line */}
        <div className="h-4 w-5/6 rounded bg-gray-200" /> {/* Second line */}
        <div className="h-4 w-4/5 rounded bg-gray-200" /> {/* Third line */}
        <div className="h-4 w-3/4 rounded bg-gray-200" /> {/* Fourth line */}
      </div>

      {/* Message input */}
      <div className="mt-8 flex animate-pulse items-center">
        <div className="h-12 flex-1 rounded-l-full bg-gray-100" />{" "}
        {/* Input field */}
        <div className="flex h-12 w-12 items-center justify-center rounded-r-full bg-gray-200">
          <div
            className={`h-6 w-6 rounded-full bg-gray-300 opacity-50 transition-opacity duration-300`}
          />
          {/* Send button */}
        </div>
      </div>
    </div>
  );
}
