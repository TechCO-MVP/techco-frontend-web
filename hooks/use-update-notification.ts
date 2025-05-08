import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface UpdateNotificationStatusInput {
  notification_ids: string[]; // batch input
  status: "READ" | "REVIEWED";
}

interface UpdateNotificationStatusResponse {
  message: string;
  updated: string[]; // optional: ids successfully updated
}

export function useUpdateNotification(
  options?: UseMutationOptions<
    UpdateNotificationStatusResponse,
    Error,
    UpdateNotificationStatusInput
  >,
) {
  return useMutation<
    UpdateNotificationStatusResponse,
    Error,
    UpdateNotificationStatusInput
  >({
    mutationFn: async ({ notification_ids, status }) => {
      const res = await fetch("/api/notification/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_id: notification_ids, status }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to update notifications");
      }

      const data = await res.json();
      console.log("useUpdateNotification Response", data);
      // Optionally validate data shape here with Zod if you have a schema

      return {
        message: data.message || "Notifications updated successfully.",
        updated: data.updated || notification_ids,
      };
    },
    ...options,
  });
}
