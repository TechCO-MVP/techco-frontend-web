"use client";

import { useNotification } from "@/lib/notification-provider";
import { useWebSocket } from "@/hooks/use-websocket";
import { FC, useCallback } from "react";
import { WebSocketNotificationPayload } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";

type Props = {
  accessToken?: string;
};

export const WebSocketListener: FC<Props> = ({ accessToken }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const baseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  console.info("[WebSocketListener] - baseUrl", baseUrl);
  const handleMessage = useCallback(
    (data: WebSocketNotificationPayload) => {
      queryClient.invalidateQueries({
        queryKey: QUERIES.NOTIFICATIONS,
      });

      const { message } = data;
      const isNew = message.status === "NEW";
      const isComment = message.notification_type === "TAGGED_IN_COMMENT";

      showNotification({
        id: message._id,
        title: message.position_name,
        badge: isNew ? "Nueva" : undefined,
        subtitle: message.profile_name,
        description: isComment
          ? "Te mencionó en un comentario"
          : message.message,
        actionLabel: isComment ? "Ver comentario" : "Ver candidato",
        timestamp: new Date(`${message.created_at}Z`).toLocaleString(),
      });
    },
    [queryClient, showNotification],
  );

  // Construct URL safely, or set it to null
  const webSocketUrl =
    accessToken && baseUrl ? `${baseUrl}?token=${accessToken}` : "";

  useWebSocket(webSocketUrl, {
    onMessage: handleMessage,
  });

  return null;
};
