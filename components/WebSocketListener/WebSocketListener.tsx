"use client";

import { useNotification } from "@/lib/notification-provider";
import { useWebSocket } from "@/hooks/use-websocket";
import { FC, useCallback, useEffect } from "react";
import { WebSocketNotificationPayload } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";

type Props = {
  accessToken?: string;
};

export const WebSocketListener: FC<Props> = ({ accessToken }) => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const baseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  console.log(
    "%c[Debug] baseUrl",
    "background-color: teal; font-size: 20px; color: white",
    baseUrl,
  );
  // Validate required values
  useEffect(() => {
    if (!accessToken) {
      console.warn("WebSocketListener: Missing accessToken");
    }
    if (!baseUrl) {
      console.error("WebSocketListener: Missing NEXT_PUBLIC_WEBSOCKET_URL");
    }
  }, [accessToken, baseUrl]);

  // Don't proceed if required inputs are missing
  if (!accessToken || !baseUrl) return null;

  const webSocketUrl = `${baseUrl}?token=${accessToken}`;

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
    [showNotification, queryClient],
  );

  useWebSocket(webSocketUrl, {
    onMessage: handleMessage,
  });

  return null;
};
