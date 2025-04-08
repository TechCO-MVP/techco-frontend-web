"use client";

import { useNotification } from "@/lib/notification-provider";
import { useWebSocket } from "@/hooks/use-websocket";
import { FC, useCallback } from "react";
import { WebSocketNotificationPayload } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";

type Props = {
  webSocketUrl: string;
};
export const WebSocketListener: FC<Props> = ({ webSocketUrl }) => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
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
          ? "Te menciono en un comentario"
          : message.message,
        actionLabel: isComment ? "Ver comentario" : "Ver cantidato",
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
