import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGetNotifications } from "@/hooks/use-get-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notification } from "@/types";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return notifications on successful fetch", async () => {
    const mockNotifications: Notification[] = [
      {
        _id: "1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        user_id: "user1",
        business_id: "biz1",
        message: "Profile filtered",
        notification_type: "PROFILE_FILTER_PROCESS",
        status: "NEW",
        process: "Reviewing",
        hiring_process_id: "hp1",
        read_at: null,
        phase_id: "phase1",
        card_id: "card1",
        profile_name: "Jane Doe",
        pipe_id: "pipe1",
        position_name: "Frontend Developer",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Success",
        body: {
          data: mockNotifications,
        },
      }),
    });

    const { result } = renderHook(() => useGetNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.notifications).toEqual(mockNotifications);
    expect(mockFetch).toHaveBeenCalledWith("/api/notification/list");
  });

  it("should handle an error response from the API", async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: "Something went wrong" }), {
          status: 500,
          statusText: "Internal Server Error",
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const { result } = renderHook(() => useGetNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBeTruthy();
  });

  it("should return undefined if body.data is missing", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Success",
        body: {}, // Missing `data`
      }),
    });

    const { result } = renderHook(() => useGetNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.notifications).toBeUndefined();
  });
});
