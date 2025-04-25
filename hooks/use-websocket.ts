"use client";

import { useEffect, useState, useCallback } from "react";
import { ws } from "@/lib/websocket/manager";
import { WebSocketMessagePayload } from "@/types";

export function useWebSocket(
  url?: string | null | undefined,
  onMessage?: (data: WebSocketMessagePayload) => void,
) {
  const [status, setStatus] = useState(ws.getStatus());

  useEffect(() => {
    // Only connect if we have a URL
    if (url) {
      ws.connect(url);
    }

    // Add message handler
    const removeMessageHandler = onMessage
      ? ws.addMessageHandler(onMessage)
      : undefined;

    // Add status handler
    const removeStatusHandler = ws.addStatusHandler(setStatus);

    // Cleanup on unmount
    return () => {
      if (removeMessageHandler) removeMessageHandler();
      if (removeStatusHandler) removeStatusHandler();
    };
  }, [url, onMessage]);

  const sendMessage = useCallback((data: any) => {
    console.log(
      "%c[Debug] message",
      "background-color: teal; font-size: 20px; color: white",
      data,
    );
    return ws.sendMessage(data);
  }, []);

  return {
    status,
    sendMessage,
    disconnect: () => ws.disconnect(),
  };
}
