import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  PostPositionConfigurationInput,
  PostPositionConfigurationResponse,
} from "@/types";

export function useCreatePositionConfiguration(
  options?: UseMutationOptions<
    PostPositionConfigurationResponse,
    Error,
    PostPositionConfigurationInput
  >,
) {
  return useMutation<
    PostPositionConfigurationResponse,
    Error,
    PostPositionConfigurationInput
  >({
    mutationFn: async (payload) => {
      const response = await fetch("/api/position-configuration/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error?.error || "Failed to create position configuration",
        );
      }
      console.info("position-configuration/create - Done.");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.info("position-configuration/create - Waited 5000ms.");

      return response.json();
    },
    ...options,
  });
}
