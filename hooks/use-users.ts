import { QUERIES } from "@/constants/queries";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  const queryResult = useQuery({
    queryKey: QUERIES.USER_LIST,
    queryFn: async () => {
      const response = await fetch("/api/user/list");

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: User[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected API response format");
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const users = queryResult.data || [];
  return {
    ...queryResult,
    users,
  };
}
