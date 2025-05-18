import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  ProfileFilterStartUrlInput,
  ProfileFilterStartUrlResponse,
} from "@/types";

export function useProfileFilterStartUrl(
  options?: UseMutationOptions<
    ProfileFilterStartUrlResponse,
    Error,
    ProfileFilterStartUrlInput
  >,
) {
  return useMutation<
    ProfileFilterStartUrlResponse,
    Error,
    ProfileFilterStartUrlInput
  >({
    mutationFn: async (payload) => {
      const response = await fetch("/api/profile/filter/start/url", {
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
