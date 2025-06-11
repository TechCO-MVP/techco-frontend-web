import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PositionData, HiringPositionByIdResponse } from "@/types";
import { QUERIES } from "@/constants/queries";

type Params = {
  id: string;
  options?: Partial<UseQueryOptions<PositionData>>;
};

export function usePositionById({ id, options }: Params) {
  return useQuery({
    queryKey: QUERIES.POSITION_BY_ID(id),
    queryFn: async () => {
      const response = await fetch(`/api/position/list?id=${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.error || "Failed to fetch position configuration",
        );
      }

      const data: HiringPositionByIdResponse = await response.json();
      return data.body.data;
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
