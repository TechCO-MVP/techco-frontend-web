import { QUERIES } from "@/constants/queries";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

type QueryUsersParams = {
  businessId?: string;
  userId?: string;
  all?: boolean;
};

export function useUsers({
  businessId,
  userId,
  all,
  email,
}: QueryUsersParams & { email?: string }) {
  const queryResult = useQuery({
    queryKey: QUERIES.USER_LIST(businessId),
    queryFn: async () => {
      if (!businessId) {
        throw new Error("Missing required parameter: business_id");
      }

      const queryAll = userId ? undefined : (all ?? true);

      const queryParams = new URLSearchParams({ business_id: businessId });
      if (userId) queryParams.append("id", userId);
      if (queryAll !== undefined) queryParams.append("all", String(queryAll));

      const response = await fetch(`/api/user/list?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data.body?.data)) {
        throw new Error("Unexpected API response format");
      }

      return data.body.data as User[];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const users = queryResult.data || [];
  const localUser = users.find((user) => user.email === email);

  return {
    ...queryResult,
    users,
    localUser,
  };
}
