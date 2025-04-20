import {
  UpdatePositionConfigurationInput,
  UpdatePositionConfigurationResponse,
} from "@/types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useUpdatePositionConfiguration(
  options?: UseMutationOptions<
    UpdatePositionConfigurationResponse,
    Error,
    UpdatePositionConfigurationInput
  >,
) {
  return useMutation<
    UpdatePositionConfigurationResponse,
    Error,
    UpdatePositionConfigurationInput
  >({
    mutationFn: async (payload) => {
      const res = await fetch("/api/position-configuration/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to update configuration");
      }

      return json;
    },
    ...options,
  });
}
