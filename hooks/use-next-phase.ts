import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { NextPhaseInput, PostPositionConfigurationResponse } from "@/types";

export function useNextPhase(
  options?: UseMutationOptions<
    PostPositionConfigurationResponse,
    Error,
    NextPhaseInput
  >,
) {
  return useMutation<PostPositionConfigurationResponse, Error, NextPhaseInput>({
    mutationFn: async (payload) => {
      const response = await fetch("/api/position-configuration/next_phase", {
        method: "POST",
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
