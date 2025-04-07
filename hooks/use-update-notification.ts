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
      const results = await Promise.allSettled(
        notification_ids.map((id) =>
          fetch("/api/notification/status", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notification_id: id, status }),
          }).then(async (res) => {
            if (!res.ok) {
              const error = await res.json();
              throw new Error(error?.error || `Failed to update ${id}`);
            }
            return id;
          }),
        ),
      );

      const updated = results
        .filter(
          (r): r is PromiseFulfilledResult<string> => r.status === "fulfilled",
        )
        .map((r) => r.value);

      const failed = results
        .filter((r): r is PromiseRejectedResult => r.status === "rejected")
        .map((r) => r.reason.message);

      if (failed.length) {
        throw new Error(`Some updates failed: ${failed.join(", ")}`);
      }

      return {
        message: "Notifications updated successfully.",
        updated,
      };
    },
    ...options,
  });
}
