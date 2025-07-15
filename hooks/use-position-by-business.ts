import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { GetPositionConfigurationListResponse } from "@/types";
import { QUERIES } from "@/constants/queries";

type Params = {
  id: string;
  options?: Partial<UseQueryOptions<GetPositionConfigurationListResponse>>;
};

export function usePositionsByBusiness({ id, options }: Params) {
  return useQuery<GetPositionConfigurationListResponse>({
    queryKey: QUERIES.POSITIONS_BY_BUSINESS(id),
    queryFn: async () => {
      const response = await fetch(`/api/position-configuration/list/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.error || "Failed to fetch position configuration",
        );
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
