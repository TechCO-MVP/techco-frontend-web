import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AssistantResponse, AssistantResponseInput } from "@/types";

export function useAssistantResponse(
  options?: UseMutationOptions<
    AssistantResponse,
    Error,
    AssistantResponseInput
  >,
) {
  return useMutation<AssistantResponse, Error, AssistantResponseInput>({
    mutationFn: async (payload) => {
      const response = await fetch("/api/hiring-process/assistant/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error || "Failed to get assistant response");
      }

      return response.json();
    },
    ...options,
  });
}
