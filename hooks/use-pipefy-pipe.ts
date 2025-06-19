import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";
import { GET_PIPE } from "@/lib/graphql/queries";
import { BoardState, PipefyPipeResponse } from "@/types/pipefy";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import { QUERIES } from "@/constants/queries";

type QueryPipeParams = {
  pipeId?: string;
  options?: Partial<UseQueryOptions<BoardState>>;
};

export function usePipefyPipe({ pipeId, options }: QueryPipeParams) {
  const fetchPipe = async (): Promise<BoardState> => {
    const data = await graphQLClient.request<PipefyPipeResponse>(GET_PIPE, {
      pipeId,
    });
    return new PipefyBoardTransformer(data).toBoardState();
  };

  const queryResult = useQuery({
    queryKey: QUERIES.PIPE_DATA(pipeId),
    queryFn: fetchPipe,
    enabled: !!pipeId,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });

  return {
    ...queryResult,
    boardState: queryResult.data,
  };
}
