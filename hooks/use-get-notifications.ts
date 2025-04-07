import { QUERIES } from "@/constants/queries";
import { GetNotificationsApiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGetNotifications() {
  const queryResult = useQuery<GetNotificationsApiResponse>({
    queryKey: QUERIES.NOTIFICATIONS,
    queryFn: async () => {
      const response = await fetch("/api/notification/list");

      if (!response.ok) {
        const json = await response.json();
        throw new Error(
          `Error: ${response.status} ${response.statusText} ${json?.error}`,
        );
      }

      const data: GetNotificationsApiResponse = await response.json();

      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const notifications = queryResult.data?.body.data;
  return {
    ...queryResult,
    notifications,
  };
}
