import { QUERIES } from "@/constants/queries";
import { HiringProcessData } from "@/types";
import { useQuery } from "@tanstack/react-query";

type HiringProcessParams = {
  hiringProcessId: string;
};

export function useHiringProcess({ hiringProcessId }: HiringProcessParams) {
  const queryResult = useQuery({
    queryKey: QUERIES.HIRING_PROCESS(hiringProcessId),
    queryFn: async () => {
      if (!hiringProcessId) {
        throw new Error("Missing required parameter: business_id");
      }

      const queryParams = new URLSearchParams({
        hiring_process_id: hiringProcessId,
      });

      const response = await fetch(
        `/api/hiring-process/id?${queryParams.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.body.data) {
        throw new Error("Unexpected API response format");
      }

      return data.body.data as HiringProcessData;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!hiringProcessId,
  });

  const hiringProcess = queryResult.data ?? null;
  return {
    ...queryResult,
    hiringProcess,
  };
}
