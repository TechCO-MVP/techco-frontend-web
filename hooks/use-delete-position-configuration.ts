import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  DeletePositionConfigurationInput,
  DeletePositionConfigurationResponse,
} from "@/types";

export function useDeletePositionConfiguration(
  options?: UseMutationOptions<
    DeletePositionConfigurationResponse,
    Error,
    DeletePositionConfigurationInput
  >,
) {
  return useMutation<
    DeletePositionConfigurationResponse,
    Error,
    DeletePositionConfigurationInput
  >({
    mutationFn: async (payload) => {
      const response = await fetch("/api/position-configuration/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error || "Failed to start next phase");
      }

      return response.json();
    },
    ...options,
  });
}
