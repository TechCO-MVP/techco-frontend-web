import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  CreatePositionInput,
  PostPositionConfigurationResponse,
} from "@/types";

export function useCreatePosition(
  options?: UseMutationOptions<
    PostPositionConfigurationResponse,
    Error,
    CreatePositionInput
  >,
) {
  return useMutation<
    PostPositionConfigurationResponse,
    Error,
    CreatePositionInput
  >({
    mutationFn: async (payload) => {
      const response = await fetch(
        "/api/position-configuration/create/position",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error?.message || error?.error || "Failed to create position",
        );
      }

      return response.json();
    },
    ...options,
  });
}
