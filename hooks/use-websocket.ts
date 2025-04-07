"use client";

import { WebSocketNotificationPayload } from "@/types";
import { useEffect, useRef, useState, useCallback } from "react";

type WebSocketStatus = "connecting" | "connected" | "disconnected";

interface UseWebSocketOptions {
  onMessage?: (data: WebSocketNotificationPayload) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
}

export function useWebSocket(
  baseUrl: string,
  {
    onMessage,
    reconnect = true,
    reconnectInterval = 3000,
  }: UseWebSocketOptions = {},
) {
  const [status, setStatus] = useState<WebSocketStatus>("connecting");
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    const url = new URL(baseUrl);
    const socket = new WebSocket(url.toString());
    socketRef.current = socket;

    setStatus("connecting");

    socket.onopen = (event) => {
      setStatus("connected");
    };

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onMessage?.(parsed);
      } catch {
        onMessage?.(event.data);
      }
    };

    socket.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    socket.onclose = (event) => {
      setStatus("disconnected");
      if (reconnect) {
        reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
      }
    };
  }, [baseUrl, onMessage, reconnect, reconnectInterval]);

  const sendMessage = useCallback((data: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        typeof data === "string" ? data : JSON.stringify(data),
      );
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    socketRef.current?.close();
    socketRef.current = null;
    setStatus("disconnected");
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    status,
    sendMessage,
    disconnect,
  };
}
