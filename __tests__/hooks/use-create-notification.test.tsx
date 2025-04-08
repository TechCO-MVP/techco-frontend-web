import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCreateNotification } from "@/hooks/use-create-notification";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateNotificationInput } from "@/types";

// Mocks
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const input: CreateNotificationInput = {
  user_id: "user-1",
  business_id: "biz-1",
  message: "Hello",
  notification_type: "PHASE_CHANGE",
  hiring_process_id: "process-1",
  phase_id: "phase-1",
};

describe("useCreateNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a notification successfully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        notification_id: "notif-1",
        message: "Notification created",
      }),
    });

    const { result } = renderHook(() => useCreateNotification(), { wrapper });

    result.current.mutate(input);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      notification_id: "notif-1",
      message: "Notification created",
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/notification/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  });

  it("should handle API error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Something went wrong" }),
    });

    const { result } = renderHook(() => useCreateNotification(), { wrapper });

    result.current.mutate(input);

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Something went wrong");
  });

  it("should handle invalid JSON error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    const { result } = renderHook(() => useCreateNotification(), { wrapper });

    result.current.mutate(input);

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Failed to create notification");
  });

  it("should handle network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useCreateNotification(), { wrapper });

    result.current.mutate(input);

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Network error");
  });
});
