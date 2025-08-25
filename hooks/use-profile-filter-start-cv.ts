import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  ProfileFilterStartCvInput,
  ProfileFilterStartResponse,
} from "@/types";

export function useProfileFilterStartCv(
  options?: UseMutationOptions<
    ProfileFilterStartResponse,
    Error,
    ProfileFilterStartCvInput
  >,
) {
  return useMutation<
    ProfileFilterStartResponse,
    Error,
    ProfileFilterStartCvInput
  >({
    mutationFn: async (payload) => {
      const formData = new FormData();
      formData.append("business_id", payload.business_id);
      formData.append("position_id", payload.position_id);
      formData.append("file", payload.file);
      formData.append("email", payload.email);

      const response = await fetch("/api/profile/filter/start/cv", {
        method: "POST",
        body: formData,
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
