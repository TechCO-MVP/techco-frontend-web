import { QUERIES } from "@/constants/queries";
import { useQuery } from "@tanstack/react-query";
import { Position } from "@/types";

export function useOpenPositions() {
  const queryResult = useQuery({
    queryKey: QUERIES.POSITION_LIST,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch("/api/open-positions");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Position[] = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const positions = queryResult.data || [];
  return { ...queryResult, positions };
}
