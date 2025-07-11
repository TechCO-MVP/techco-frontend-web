import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { GetPositionConfigurationListResponse } from "@/types";
import { QUERIES } from "@/constants/queries";

type Params = {
  businessId: string;
  id?: string;
  all?: boolean;
  options?: Partial<UseQueryOptions<GetPositionConfigurationListResponse>>;
};

export function usePositionConfigurations({
  businessId,
  id,
  all,
  options,
}: Params) {
  return useQuery<GetPositionConfigurationListResponse>({
    queryKey: QUERIES.POSITION_CONFIG_LIST(businessId, id),
    queryFn: async () => {
      const params = new URLSearchParams({
        business_id: businessId,
      });
      if (id) params.append("id", id);
      if (all !== undefined) params.append("all", String(all));

      const response = await fetch(
        `/api/position-configuration/list?${params.toString()}`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.error || "Failed to fetch position configuration",
        );
      }

      return response.json();
    },
    enabled: !!businessId,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
