import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";
import { GET_PIPES } from "@/lib/graphql/queries";
import { PipefyPipesResponse } from "@/types/pipefy";
import { QUERIES } from "@/constants/queries";

type QueryPipesParams = {
  ids?: string[];
  options?: Partial<UseQueryOptions<PipefyPipesResponse>>;
};

export function usePipefyPipes({ ids, options }: QueryPipesParams) {
  const fetchPipe = async (): Promise<PipefyPipesResponse> => {
    const data = await graphQLClient.request<PipefyPipesResponse>(GET_PIPES, {
      ids,
    });
    return data;
  };

  const queryResult = useQuery({
    queryKey: QUERIES.PIPES_DATA(ids?.join("-")),
    queryFn: fetchPipe,
    enabled: !!ids,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });

  return {
    ...queryResult,
    pipes: queryResult.data?.pipes,
  };
}
