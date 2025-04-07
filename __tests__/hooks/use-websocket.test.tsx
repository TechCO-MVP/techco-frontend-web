// __tests__/hooks/use-websocket.test.tsx
import { renderHook, act } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  MockInstance,
} from "vitest";
import { useWebSocket } from "@/hooks/use-websocket";

// We'll mock WebSocket to simulate events
let mockSocket: any;
let listeners: Record<string, Function>;

vi.stubGlobal(
  "WebSocket",
  vi.fn().mockImplementation((url: string) => {
    listeners = {};
    mockSocket = {
      url,
      readyState: WebSocket.CONNECTING,
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: (event: string, cb: Function) => {
        listeners[event] = cb;
      },
      removeEventListener: vi.fn(),
      set onopen(cb: (this: WebSocket, ev: Event) => void) {
        listeners["open"] = cb;
      },
      set onmessage(cb: (this: WebSocket, ev: MessageEvent) => void) {
        listeners["message"] = cb;
      },
      set onerror(cb: (this: WebSocket, ev: Event) => void) {
        listeners["error"] = cb;
      },
      set onclose(cb: (this: WebSocket, ev: CloseEvent) => void) {
        listeners["close"] = cb;
      },
    };
    return mockSocket;
  }),
);

describe("useWebSocket", () => {
  let setTimeoutSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Use fake timers to control timeouts
    vi.useFakeTimers();
    // Spy on global setTimeout
    setTimeoutSpy = vi.spyOn(global, "setTimeout") as unknown as MockInstance<
      (...args: any[]) => any
    >;
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  it("should establish a WebSocket connection and update status", async () => {
    const { result } = renderHook(() => useWebSocket("ws://localhost/ws"));

    expect(result.current.status).toBe("connecting");

    // Simulate connection open
    act(() => {
      listeners["open"]?.();
    });

    expect(result.current.status).toBe("connected");
  });

  it("should handle incoming messages and parse JSON", async () => {
    const onMessage = vi.fn();
    renderHook(() => useWebSocket("ws://localhost/ws", { onMessage }));

    act(() => {
      listeners["open"]?.();
    });

    const payload = { message: "Hello" };
    act(() => {
      listeners["message"]?.({ data: JSON.stringify(payload) });
    });

    expect(onMessage).toHaveBeenCalledWith(payload);
  });

  it("should send messages when socket is open", async () => {
    const { result } = renderHook(() => useWebSocket("ws://localhost/ws"));

    mockSocket.readyState = WebSocket.OPEN;

    act(() => {
      result.current.sendMessage({ test: "123" });
    });

    expect(mockSocket.send).toHaveBeenCalledWith(
      JSON.stringify({ test: "123" }),
    );
  });

  it("should disconnect the socket", () => {
    const { result, unmount } = renderHook(() =>
      useWebSocket("ws://localhost/ws"),
    );

    act(() => {
      result.current.disconnect();
    });

    expect(mockSocket.close).toHaveBeenCalled();
    expect(result.current.status).toBe("disconnected");

    unmount();
  });

  it("should attempt reconnect if socket closes", () => {
    renderHook(() =>
      useWebSocket("ws://localhost/ws", {
        reconnect: true,
        reconnectInterval: 5000,
      }),
    );

    // Simulate socket connection open
    act(() => {
      listeners["open"]?.();
    });

    // Simulate socket close event
    act(() => {
      listeners["close"]?.();
    });

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
  });

  it("should not reconnect if reconnect is false", () => {
    renderHook(() =>
      useWebSocket("ws://localhost/ws", {
        reconnect: false,
      }),
    );

    // Simulate socket connection open
    act(() => {
      listeners["open"]?.();
    });

    // Simulate socket close event
    act(() => {
      listeners["close"]?.();
    });

    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });
});
