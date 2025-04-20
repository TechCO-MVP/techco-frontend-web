import { useQuery } from "@tanstack/react-query";
import { GetPositionConfigurationListResponse } from "@/types";
import { QUERIES } from "@/constants/queries";

type Params = {
  id?: string;
  all?: boolean;
};

export function usePositionConfigurations({ id, all }: Params = {}) {
  return useQuery<GetPositionConfigurationListResponse>({
    queryKey: QUERIES.POSITION_CONFIG_LIST,
    queryFn: async () => {
      const params = new URLSearchParams();
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
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
