import { CreateNotificationInput } from "@/types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface CreateNotificationResponse {
  notification_id: string;
  message: string;
}

export function useCreateNotification(
  options?: UseMutationOptions<
    CreateNotificationResponse,
    Error,
    CreateNotificationInput
  >,
) {
  return useMutation<
    CreateNotificationResponse,
    Error,
    CreateNotificationInput
  >({
    mutationFn: async (payload) => {
      const res = await fetch("/api/notification/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.error || "Failed to create notification");
      }

      return res.json();
    },
    ...options,
  });
}
