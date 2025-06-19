import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  NextPhaseInput,
  PositionConfigurationTypes,
  PostPositionConfigurationResponse,
} from "@/types";

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
      console.log("env", process.env.NODE_ENV);
      console.info("position-configuration/next_phase - Done.");
      if (
        process.env.NODE_ENV !== "test" &&
        payload.configuration_type === PositionConfigurationTypes.AI_TEMPLATE
      ) {
        await new Promise((resolve) => setTimeout(resolve, 20000));
        console.info("position-configuration/next_phase - Waited 20000ms.");
      }

      return response.json();
    },
    ...options,
  });
}
