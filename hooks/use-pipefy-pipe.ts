import { useQuery } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";
import { GET_PIPE } from "@/lib/graphql/queries";
import { PipefyPipe, PipefyPipeResponse } from "@/types";

type QueryPipeParams = {
  pipeId: string;
};

export function usePipefyPipe({ pipeId }: QueryPipeParams) {
  const fetchPipe = async (): Promise<PipefyPipe> => {
    const data = await graphQLClient.request<PipefyPipeResponse>(GET_PIPE, { pipeId });
    return data.pipe;
  };

  const queryResult = useQuery({
    queryKey: ["pipefy-pipe", pipeId],
    queryFn: fetchPipe,
    enabled: !!pipeId,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10, 
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    pipe: queryResult.data,
  };
}
