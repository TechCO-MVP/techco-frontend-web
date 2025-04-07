import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";
import { GET_CARD } from "@/lib/graphql/queries";
import { PipefyCardResponse } from "@/types/pipefy";
import { QUERIES } from "@/constants/queries";

type QueryCardParams = {
  cardId?: string;
  options?: Partial<UseQueryOptions<PipefyCardResponse>>;
};

export function usePipefyCard({ cardId, options }: QueryCardParams) {
  const fetchPipe = async (): Promise<PipefyCardResponse> => {
    const data = await graphQLClient.request<PipefyCardResponse>(GET_CARD, {
      cardId,
    });
    return data;
  };

  const queryResult = useQuery({
    queryKey: QUERIES.CARD_DATA(cardId),
    queryFn: fetchPipe,
    enabled: !!cardId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });

  return {
    ...queryResult,
    card: queryResult.data?.card,
  };
}
