"use client";

import { MessageHandler, StatusChangeHandler, WebSocketStatus } from "@/types";

class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: WebSocket | null = null;
  private url: string = "";
  private status: WebSocketStatus = "disconnected";
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<StatusChangeHandler> = new Set();

  // Reconnection settings
  public reconnect: boolean = true;
  public reconnectInterval: number = 3000;
  public reconnectAttempts: number = 0;
  public maxReconnectAttempts: number = 5;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public connect(url: string): void {
    // Don't reconnect if already connected to the same URL
    if (
      this.socket &&
      this.socket.readyState === WebSocket.OPEN &&
      this.url === url
    ) {
      console.log("[ws] Already connected to", url);
      return;
    }

    // Save URL for reconnection
    this.url = url;

    // No connection if URL is empty
    if (!url) {
      console.log("[ws] No URL provided");
      return;
    }

    // Clean up existing socket
    this.disconnect();

    try {
      console.log("[ws] Connecting to", url);
      this.updateStatus("connecting");

      // Create new socket
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log("[ws] Connected");
        this.updateStatus("connected");
        this.reconnectAttempts = 0; // Reset counter on successful connection
      };

      this.socket.onmessage = (event) => {
        console.log(
          "%c[Debug] onMessage",
          "background-color: teal; font-size: 20px; color: white",
          event,
        );
        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          data = event.data;
        }

        // Notify all handlers
        this.messageHandlers.forEach((handler) => handler(data));
      };

      this.socket.onerror = (error) => {
        console.error("[ws] Error:", error);
      };

      this.socket.onclose = (event) => {
        console.log("[ws] Closed with code:", event.code);
        this.updateStatus("disconnected");
        this.socket = null;

        // Try to reconnect if it wasn't a normal closure
        if (this.reconnect && event.code !== 1000) {
          this.handleReconnect();
        }
      };
    } catch (error) {
      console.error("[ws] Connection error:", error);
      this.updateStatus("disconnected");
    }
  }

  private handleReconnect(): void {
    // Check max attempts
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("[ws] Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `[ws] Reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectInterval}ms`,
    );

    // Clear any pending reconnect
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    // Schedule reconnect
    this.reconnectTimeout = setTimeout(() => {
      if (this.url) {
        this.connect(this.url);
      }
    }, this.reconnectInterval);
  }

  public disconnect(): void {
    // Clear any pending reconnect
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Close socket if it exists
    if (this.socket) {
      try {
        this.socket.close(1000, "Normal closure");
      } catch (err) {
        console.error("[ws] Error closing socket:", err);
      }
      this.socket = null;
    }

    this.updateStatus("disconnected");
  }

  public sendMessage(data: {
    action: string;
    payload: {
      phase_type: string;
      thread_id: string;
      position_configuration_id: string;
      business_id: string;
      message: string;
    };
  }): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.log("[ws] Cannot send message - socket not connected");
      return false;
    }

    try {
      this.socket.send(typeof data === "string" ? data : JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("[ws] Error sending message:", error);
      return false;
    }
  }

  public addMessageHandler(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  public addStatusHandler(handler: StatusChangeHandler): () => void {
    this.statusHandlers.add(handler);
    handler(this.status); // Call immediately with current status
    return () => this.statusHandlers.delete(handler);
  }

  private updateStatus(newStatus: WebSocketStatus): void {
    if (this.status === newStatus) return;
    this.status = newStatus;
    this.statusHandlers.forEach((handler) => handler(newStatus));
  }

  public getStatus(): WebSocketStatus {
    return this.status;
  }
}

// Export the singleton instance
export const ws = WebSocketManager.getInstance();
