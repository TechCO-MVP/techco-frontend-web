import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CompletePhaseInput, CompletePhaseResponse } from "@/types";

export function useCompletePhase(
  options?: UseMutationOptions<
    CompletePhaseResponse,
    Error,
    CompletePhaseInput
  >,
) {
  return useMutation<CompletePhaseResponse, Error, CompletePhaseInput>({
    mutationFn: async (payload) => {
      const response = await fetch(
        "/api/position-configuration/complete/phase",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error || "Failed to complete phase");
      }

      return response.json();
    },
    ...options,
  });
}
