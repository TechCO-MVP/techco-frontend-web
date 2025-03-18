import { QUERIES } from "@/constants/queries";
import { PositionFilterStatusResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

type ProfileFilterParams = {
  positionId: string;
};

export function useProfileFilterStatus({ positionId }: ProfileFilterParams) {
  const queryResult = useQuery<PositionFilterStatusResponse>({
    queryKey: QUERIES.PROFILE_FILTER_STATUS(positionId),
    queryFn: async () => {
      if (!positionId) {
        throw new Error("Missing required parameter: positionId");
      }

      const queryParams = new URLSearchParams({
        position_id: positionId,
      });

      const response = await fetch(
        `/api/profile/filter?${queryParams.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json() as Promise<PositionFilterStatusResponse>;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!positionId,
    refetchInterval: (query) => {
      const cachedData = query.state.data;

      if (!cachedData) return false;

      return cachedData.body.status === "completed" ? false : 10000;
    },
  });

  const positionStatus = queryResult.data?.body || [];
  return { ...queryResult, positionStatus };
}
