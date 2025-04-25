import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { MessageHistoryResponse } from "@/types";

type UseMessageHistoryParams = {
  threadId?: string;
  limit?: number;
};

export function useMessageHistory({
  threadId,
  limit = 20,
}: UseMessageHistoryParams) {
  const queryResult = useInfiniteQuery<MessageHistoryResponse>({
    queryKey: QUERIES.MESSAGE_HISTORY(threadId, limit),
    initialPageParam: null,
    enabled: Boolean(threadId),
    getNextPageParam: (lastPage) => lastPage?.body?.data?.last_id ?? undefined,
    queryFn: async ({ pageParam }) => {
      if (!threadId) throw new Error("Missing required parameter: threadId");

      const queryParams = new URLSearchParams();
      if (limit) queryParams.append("limit", String(limit));
      if (pageParam) queryParams.append("message_id", pageParam as string);

      const res = await fetch(
        `/api/llm/message-history/${threadId}?${queryParams.toString()}`,
      );

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.error || "Failed to fetch message history");
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const messages =
    queryResult.data?.pages
      .flatMap((page) => page.body?.data?.data ?? [])
      .reverse() ?? [];

  const lastMessageId =
    queryResult.data?.pages.at(-1)?.body?.data?.last_id ?? null;
  const firstMessageId =
    queryResult.data?.pages.at(-1)?.body?.data?.first_id ?? null;
  const hasMore = queryResult.data?.pages.at(-1)?.body?.data?.has_more ?? false;

  return {
    ...queryResult,
    messages,
    hasMore,
    lastMessageId,
    firstMessageId,
  };
}
