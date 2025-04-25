import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWebSocket } from "@/hooks/use-websocket"; // Adjust path as needed
import { WebSocketStatus } from "@/types";

// Mock the websocket manager
vi.mock("@/lib/websocket/manager", () => {
  return {
    ws: {
      connect: vi.fn(),
      disconnect: vi.fn(),
      getStatus: vi.fn(() => "disconnected"),
      addMessageHandler: vi.fn(() => vi.fn()),
      addStatusHandler: vi.fn(() => vi.fn()),
      sendMessage: vi.fn(() => true),
    },
  };
});

// Import mocks after they're defined
import { ws } from "@/lib/websocket/manager";

describe("useWebSocket", () => {
  const mockUrl = "ws://test.com";
  const mockMessageHandler = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should initialize with the correct status", () => {
    vi.mocked(ws.getStatus).mockReturnValue("disconnected");

    const { result } = renderHook(() => useWebSocket());

    expect(result.current.status).toBe("disconnected");
  });

  it("should connect to WebSocket when URL is provided", () => {
    renderHook(() => useWebSocket(mockUrl));

    expect(ws.connect).toHaveBeenCalledWith(mockUrl);
  });

  it("should not connect when URL is null or undefined", () => {
    renderHook(() => useWebSocket(null));

    expect(ws.connect).not.toHaveBeenCalled();
  });

  it("should add message handler when onMessage is provided", () => {
    renderHook(() => useWebSocket(mockUrl, mockMessageHandler));

    expect(ws.addMessageHandler).toHaveBeenCalledWith(mockMessageHandler);
  });

  it("should not add message handler when onMessage is not provided", () => {
    renderHook(() => useWebSocket(mockUrl));

    expect(ws.addMessageHandler).not.toHaveBeenCalled();
  });

  it("should add status handler", () => {
    renderHook(() => useWebSocket(mockUrl));

    expect(ws.addStatusHandler).toHaveBeenCalled();
  });

  it("should update status when status handler is called", () => {
    vi.mocked(ws.getStatus).mockReturnValue("disconnected");

    // Mock status handler callback
    let statusCallback: (status: WebSocketStatus) => void;
    vi.mocked(ws.addStatusHandler).mockImplementation((callback) => {
      statusCallback = callback;
      return vi.fn();
    });

    const { result } = renderHook(() => useWebSocket(mockUrl));

    // Initial status
    expect(result.current.status).toBe("disconnected");

    // Simulate WebSocket status change
    act(() => {
      statusCallback!("connected");
    });

    // Updated status
    expect(result.current.status).toBe("connected");
  });

  it("should call sendMessage correctly", () => {
    const { result } = renderHook(() => useWebSocket(mockUrl));

    const testData = { type: "test", payload: "data" };

    act(() => {
      result.current.sendMessage(testData);
    });

    expect(ws.sendMessage).toHaveBeenCalledWith(testData);
  });

  it("should call disconnect when disconnect function is called", () => {
    const { result } = renderHook(() => useWebSocket(mockUrl));

    act(() => {
      result.current.disconnect();
    });

    expect(ws.disconnect).toHaveBeenCalled();
  });

  it("should cleanup handlers on unmount", () => {
    const mockMessageHandlerRemove = vi.fn();
    const mockStatusHandlerRemove = vi.fn();

    vi.mocked(ws.addMessageHandler).mockReturnValueOnce(
      mockMessageHandlerRemove,
    );
    vi.mocked(ws.addStatusHandler).mockReturnValueOnce(mockStatusHandlerRemove);

    const { unmount } = renderHook(() =>
      useWebSocket(mockUrl, mockMessageHandler),
    );

    unmount();

    expect(mockMessageHandlerRemove).toHaveBeenCalled();
    expect(mockStatusHandlerRemove).toHaveBeenCalled();
  });

  it("should reconnect when URL changes", () => {
    const newUrl = "ws://new-test.com";
    const { rerender } = renderHook(({ url }) => useWebSocket(url), {
      initialProps: { url: mockUrl },
    });

    expect(ws.connect).toHaveBeenCalledWith(mockUrl);

    rerender({ url: newUrl });

    expect(ws.connect).toHaveBeenCalledWith(newUrl);
    expect(ws.connect).toHaveBeenCalledTimes(2);
  });

  it("should update message handler when onMessage changes", () => {
    const initialHandler = vi.fn();
    const newHandler = vi.fn();

    const mockRemoveInitial = vi.fn();
    const mockRemoveNew = vi.fn();

    vi.mocked(ws.addMessageHandler).mockImplementationOnce(
      () => mockRemoveInitial,
    );
    vi.mocked(ws.addMessageHandler).mockImplementationOnce(() => mockRemoveNew);

    const { rerender } = renderHook(
      ({ handler }) => useWebSocket(mockUrl, handler),
      {
        initialProps: { handler: initialHandler },
      },
    );

    expect(ws.addMessageHandler).toHaveBeenCalledWith(initialHandler);

    rerender({ handler: newHandler });

    expect(mockRemoveInitial).toHaveBeenCalled();
    expect(ws.addMessageHandler).toHaveBeenCalledWith(newHandler);
  });
});
