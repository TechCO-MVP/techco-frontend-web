import { QUERIES } from "@/constants/queries";
import { CurrentUserApiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const queryResult = useQuery({
    queryKey: QUERIES.CURRENT_USER,
    queryFn: async () => {
      const response = await fetch("/api/current-user");

      if (!response.ok) {
        const json = await response.json();
        throw new Error(
          `Error: ${response.status} ${response.statusText} ${json?.error}`,
        );
      }

      const data: CurrentUserApiResponse = await response.json();

      return data.body;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const currentUser = queryResult.data?.user || null;
  console.log("[Debug]", currentUser);
  return {
    ...queryResult,
    currentUser,
  };
}
