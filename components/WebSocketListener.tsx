"use client";

import { useNotification } from "@/lib/notification-provider";
import { useWebSocket } from "@/hooks/use-websocket";
import { useCallback } from "react";
import { WebSocketNotificationPayload } from "@/types";
export const WebSocketListener = () => {
  const { showNotification } = useNotification();

  const handleMessage = useCallback(
    (data: WebSocketNotificationPayload) => {
      const { message } = data;
      const isNew = message.status === "NEW";
      const isComment = message.notification_type === "TAGGED_IN_COMMENT";
      showNotification({
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
    [showNotification],
  );
  useWebSocket(
    "wss://y7fav1lech.execute-api.us-east-1.amazonaws.com/dev?token=eyJraWQiOiJLYzhNVjNxQjh5ZTNGc3phUVVlSUZCZ1pvVnorZ3pma3kxZ0dyWnpJRDFFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNDc4NzQ0OC0zMGUxLTcwMTAtZGQ5YS1kNzU4ZGZkNjUxMTEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9YbUhxcHk1MnQiLCJjbGllbnRfaWQiOiIzcjkxN24xMmJ0YmpjOGRrNHNob2w0cWk3ayIsIm9yaWdpbl9qdGkiOiIxYmM1MTc0Ni02NTJmLTRkNmMtYTU5Ni1iYTFhZDVjNzQ3ZjIiLCJldmVudF9pZCI6IjVlY2FhZWRlLWIwMDYtNGM3NC1hNzA5LWY0NzhkZjBjM2QyYyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NDM3MDQ0NjEsImV4cCI6MTc0Mzc5MDg2MSwiaWF0IjoxNzQzNzA0NDYxLCJqdGkiOiI0MjllNDFmNS0xMWQ0LTQ1NjUtYTNiYS00ODEwMGFjYjdmMDEiLCJ1c2VybmFtZSI6ImY0Nzg3NDQ4LTMwZTEtNzAxMC1kZDlhLWQ3NThkZmQ2NTExMSJ9.l-rYn5qWxHGuULKCSs4HrdIqj7aQQSpets6OuLriaLp_BWFc0BGRTfjOCnAQRtM88RNvuamBZVj1tkKHB0BrFrRoLQb-QTaWQUoBxMStT7ULcYXiUreq7kMj1n9TaI36ipkhn5C7aWnPyEWKWm5w4XP-odwZR_ug9mbqMc_CEFtZxrQUiJPPjvasGXkKlyN86AQCAy3w8g7DNxastTidVDj33_Uv3bhC-TCjuU1rcIlJEphszQbJzPboLeALG-6S1yMh6BgOBRbGgtItTjvFsjNP-Uyku8lhNJov0fcR2oEmZOAal--pv364stO7b_VX91Yxn6FJo7N5H2hva50Omg",
    {
      onMessage: handleMessage,
    },
  );

  return null;
};
