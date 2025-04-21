"use client";

import { WebSocketMessagePayload } from "@/types";
import { useEffect, useRef, useState, useCallback } from "react";

type WebSocketStatus = "connecting" | "connected" | "disconnected";

interface UseWebSocketOptions {
  onMessage?: (data: WebSocketMessagePayload) => void;
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
    // Check if socket already exists and is connecting or connected
    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.CONNECTING ||
        socketRef.current.readyState === WebSocket.OPEN)
    ) {
      console.info("[wsAlreadyActive] Socket already connecting or connected");
      return;
    }

    // Clean up any existing socket before creating a new one
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    // Create new WebSocket connection
    const url = new URL(baseUrl);
    const socket = new WebSocket(url.toString());
    socketRef.current = socket;

    setStatus("connecting");

    socket.onopen = (event) => {
      console.info("[wsConnected]");
      setStatus("connected");
    };

    socket.onmessage = (event) => {
      console.info("[wsMessage]");
      try {
        const parsed = JSON.parse(event.data);
        onMessage?.(parsed);
      } catch {
        onMessage?.(event.data);
      }
    };

    socket.onerror = (e) => {
      console.warn("[wsError]");
      console.error("WebSocket error:", e);
    };

    socket.onclose = (event) => {
      console.info("[wsClosed]");
      setStatus("disconnected");
      if (reconnect && socketRef.current === socket) {
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
      reconnectTimeoutRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setStatus("disconnected");
    }
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
