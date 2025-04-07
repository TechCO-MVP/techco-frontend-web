// __tests__/hooks/use-profile-filter-status.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProfileFilterStatus } from "@/hooks/use-profile-filter-status";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useProfileFilterStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns profile filter status data successfully", async () => {
    const mockResponse = {
      body: {
        status: "in_progress",
        progress: 50,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(
      () =>
        useProfileFilterStatus({
          positionId: "123",
          options: { retry: false },
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.positionStatus).toEqual(mockResponse.body);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/profile/filter?position_id=123",
    );
  });

  it("handles error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const { result } = renderHook(
      () =>
        useProfileFilterStatus({
          positionId: "123",
          options: { retry: false },
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toMatch(/500 Internal Server Error/);
  });

  it("does not run query when positionId is missing", async () => {
    const { result } = renderHook(
      () =>
        useProfileFilterStatus({ positionId: "", options: { retry: false } }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.status).toBe("pending");
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });
});
