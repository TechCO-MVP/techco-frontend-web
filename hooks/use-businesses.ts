import { QUERIES } from "@/constants/queries";
import { ListBusinessApiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useBusinesses() {
  const queryResult = useQuery({
    queryKey: QUERIES.COMPANY_LIST,
    queryFn: async () => {
      const response = await fetch("/api/business/list");

      if (!response.ok) {
        const json = await response.json();
        throw new Error(
          `Error: ${response.status} ${response.statusText} ${json?.error}`,
        );
      }

      const data: ListBusinessApiResponse = await response.json();

      if (!Array.isArray(data.body)) {
        throw new Error("Unexpected API response format");
      }

      return data.body;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const businesses = queryResult.data || [];

  const rootBusiness =
    businesses.find((business) => business.parent_business_id === null) || null;

  return {
    ...queryResult,
    businesses,
    rootBusiness,
  };
}
