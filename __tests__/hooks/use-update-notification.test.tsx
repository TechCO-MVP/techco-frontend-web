// __tests__/hooks/use-update-notification.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUpdateNotification } from "@/hooks/use-update-notification";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useUpdateNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully updates multiple notifications", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useUpdateNotification(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      notification_ids: ["id1", "id2"],
      status: "READ",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.message).toBe(
      "Notifications updated successfully.",
    );
    expect(result.current.data?.updated).toEqual(["id1", "id2"]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("partially fails and returns error with failed IDs", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Server error for id1" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    const { result } = renderHook(() => useUpdateNotification(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      notification_ids: ["id1", "id2"],
      status: "REVIEWED",
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toMatch(/Some updates failed/);
  });

  it("fails all requests", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Complete failure" }),
    });

    const { result } = renderHook(() => useUpdateNotification(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      notification_ids: ["id1", "id2"],
      status: "READ",
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error?.message).toMatch(/Some updates failed/);
  });
});
