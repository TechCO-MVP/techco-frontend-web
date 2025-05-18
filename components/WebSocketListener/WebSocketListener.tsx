"use client";

import { useNotification } from "@/lib/notification-provider";
import { useWebSocket } from "@/hooks/use-websocket";
import { FC, useCallback, useEffect } from "react";
import {
  NotificationPayload,
  WebSocketMessagePayload,
  HiringPositionData,
} from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { setNotificationsState } from "@/lib/store/features/notifications/notifications";
import { Locale } from "@/i18n-config";

type Props = {
  accessToken?: string;
};

export const WebSocketListener: FC<Props> = ({ accessToken }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { showNotification, hideNotification } = useNotification();
  const params = useParams<{ lang: Locale }>();
  const { lang } = params;
  const baseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

  const onNotificationClick = useCallback(
    (message: NotificationPayload["message"]) => {
      const cachedQueries = queryClient.getQueriesData<HiringPositionData[]>({
        queryKey: ["positions"],
        exact: false,
      });

      const allPositions = cachedQueries.flatMap(([, data]) => data ?? []);
      const position = allPositions.find(
        (position) => position.pipe_id === message.pipe_id,
      );
      if (!position) return;
      dispatch(
        setNotificationsState({
          showCandidateDetails: {
            cardId: message.card_id,
            phaseId: message.phase_id,
            defaultTab:
              message.notification_type === "TAGGED_IN_COMMENT"
                ? "comments"
                : "about",
          },
        }),
      );
      hideNotification();
      router.push(`/${lang}/dashboard/positions/${position._id}`);
    },
    [dispatch, hideNotification, lang, queryClient, router],
  );

  const handleMessage = useCallback(
    (data: WebSocketMessagePayload) => {
      console.info("[WebSocketListener] - message", data);
      if (!data.payload) return;
      if ("response_type" in data.payload) return;
      const { action, payload } = data;
      if (!action || !payload) return;
      if (action === "chat_message") return;
      queryClient.invalidateQueries({
        queryKey: QUERIES.NOTIFICATIONS,
      });
      const { message } = payload;
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
        onAction: () => {
          onNotificationClick(message);
        },
      });
    },
    [queryClient, showNotification, onNotificationClick],
  );

  // Construct WebSocket URL
  const webSocketUrl =
    baseUrl && accessToken ? `${baseUrl}?token=${accessToken}` : null;

  // Use the WebSocket
  const { status } = useWebSocket(webSocketUrl, handleMessage);

  useEffect(() => {
    console.info(`[WebSocketListener] WebSocket status: ${status}`);
  }, [status]);

  return null;
};
