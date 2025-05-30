import {
  UpdateHiringProcessCustomFieldsInput,
  UpdateHiringProcessCustomFieldsResponse,
} from "@/types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useUpdateHiringProcessCustomFields(
  options?: UseMutationOptions<
    UpdateHiringProcessCustomFieldsResponse,
    Error,
    UpdateHiringProcessCustomFieldsInput
  >,
) {
  return useMutation<
    UpdateHiringProcessCustomFieldsResponse,
    Error,
    UpdateHiringProcessCustomFieldsInput
  >({
    mutationFn: async (payload) => {
      const res = await fetch("/api/hiring-process/custom-fields/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to update hiring process");
      }

      return json;
    },
    ...options,
  });
}
