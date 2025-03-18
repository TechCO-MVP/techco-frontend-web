import { QUERIES } from "@/constants/queries";
import { useQuery } from "@tanstack/react-query";
import { HiringPositionResponse } from "@/types";

type QueryPositionsParams = {
  businessId?: string;
  positionId?: string;
  all?: boolean;
};

export function useOpenPositions({
  businessId,
  all,
  positionId,
}: QueryPositionsParams) {
  const queryResult = useQuery({
    queryKey: QUERIES.POSITION_LIST(businessId, all),
    queryFn: async () => {
      if (!businessId) {
        throw new Error("Missing required parameter: business_id");
      }
      const queryAll = positionId ? undefined : (all ?? true);
      const queryParams = new URLSearchParams({
        business_id: businessId,
      });
      if (positionId) queryParams.append("id", positionId);
      if (queryAll !== undefined) queryParams.append("all", String(queryAll));

      const response = await fetch(
        `/api/open-positions?${queryParams.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data: HiringPositionResponse = await response.json();
      return data.body.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!businessId,
  });

  const positions = queryResult.data || [];
  return { ...queryResult, positions };
}
