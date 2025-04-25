import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { ws } from "@/lib/websocket/manager";

describe("WebSocketManager", () => {
  let mockSocket: any;
  beforeEach(() => {
    vi.useFakeTimers();

    // Mock WebSocket
    mockSocket = {
      send: vi.fn(),
      close: vi.fn(),
      readyState: WebSocket.OPEN,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
    } as unknown as WebSocket;

    global.WebSocket = vi.fn(() => mockSocket) as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
    ws.disconnect(); // ensure singleton state is reset
  });

  it("should connect to a websocket URL", () => {
    ws.connect("ws://localhost");
    expect(global.WebSocket).toHaveBeenCalledWith("ws://localhost");
  });

  it("should not reconnect if already connected to the same URL", () => {
    ws.connect("ws://localhost");
    mockSocket.readyState = WebSocket.OPEN;
    ws.connect("ws://localhost");
    expect(global.WebSocket).toHaveBeenCalledTimes(1);
  });

  it("should send a message when socket is open", () => {
    ws.connect("ws://localhost");

    // Simulate open state
    mockSocket.readyState = WebSocket.OPEN;

    ws.sendMessage("hello");

    expect(mockSocket.send).toHaveBeenCalledWith("hello");
  });

  it("should not send message if socket is not connected", () => {
    mockSocket.readyState = 0;
    ws.connect("ws://localhost");
    const result = ws.sendMessage("test");
    expect(result).toBe(false);
  });

  it("should call message handler on message", () => {
    const handler = vi.fn();
    ws.addMessageHandler(handler);

    ws.connect("ws://localhost");

    const message = { foo: "bar" };

    // Simulate incoming message on the mocked socket
    const mockSocket = (global.WebSocket as unknown as Mock).mock.results[0]
      .value;
    mockSocket.onmessage?.({ data: JSON.stringify(message) });

    expect(handler).toHaveBeenCalledWith(message);
  });

  it("should call status handler on connect and disconnect", () => {
    const statusHandler = vi.fn();
    ws.addStatusHandler(statusHandler);
    ws.connect("ws://localhost");

    mockSocket.onopen();

    expect(statusHandler).toHaveBeenCalledWith("connecting");
    expect(statusHandler).toHaveBeenCalledWith("connected");

    mockSocket.onclose({ code: 1000 });
    expect(statusHandler).toHaveBeenCalledWith("disconnected");
  });

  it("should attempt reconnection if socket closes unexpectedly", () => {
    ws.connect("ws://localhost");
    mockSocket.onclose({ code: 4000 }); // non-normal close
    vi.advanceTimersByTime(ws.reconnectInterval);
    expect(global.WebSocket).toHaveBeenCalledTimes(2);
  });

  it("should not reconnect beyond maxReconnectAttempts", () => {
    vi.useFakeTimers();

    ws.maxReconnectAttempts = 3;
    ws.reconnectInterval = 1000;

    ws.connect("ws://localhost");

    // Simulate disconnection triggering reconnection
    const socketInstance = (global.WebSocket as any).mock.results[0].value;
    socketInstance.onclose?.({ code: 1006 }); // trigger reconnect #1

    // First reconnect
    vi.advanceTimersByTime(1000);

    const socketInstance2 = (global.WebSocket as any).mock.results[1].value;
    socketInstance2.onclose?.({ code: 1006 }); // trigger reconnect #2

    // Second reconnect
    vi.advanceTimersByTime(1000);

    const socketInstance3 = (global.WebSocket as any).mock.results[2]?.value;
    socketInstance3?.onclose?.({ code: 1006 }); // this should **not** trigger another reconnect

    // Third reconnect (should not happen)
    vi.advanceTimersByTime(1000);

    expect(global.WebSocket).toHaveBeenCalledTimes(3); // Initial + 2 reconnects

    vi.useRealTimers();
  });

  it("should disconnect properly", () => {
    ws.connect("ws://localhost");
    ws.disconnect();
    expect(mockSocket.close).toHaveBeenCalled();
    expect(ws.getStatus()).toBe("disconnected");
  });
});
