import { QUERIES } from "@/constants/queries";
import { FileProcessingStatus } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useFileProcessingStatus(id: string | null) {
  const queryResult = useQuery({
    queryKey: [QUERIES.FILE_PROCESSING_STATUS, id],
    queryFn: async () => {
      const response = await fetch(`/api/hiring-process/check-status/${id}`);

      if (!response.ok) {
        const json = await response.json();
        throw new Error(
          `Error: ${response.status} ${response.statusText} ${json?.error}`,
        );
      }

      const data: FileProcessingStatus = await response.json();

      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

  const fileProcessingStatus = queryResult.data;

  return {
    ...queryResult,
    fileProcessingStatus,
  };
}
