// __tests__/hooks/use-open-positions.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useOpenPositions } from "@/hooks/use-open-positions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock global fetch
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

describe("useOpenPositions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch open positions successfully", async () => {
    const mockPositions = [{ id: "1", name: "Dev" }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        body: {
          data: mockPositions,
        },
      }),
    });

    const { result } = renderHook(
      () =>
        useOpenPositions({
          businessId: "biz123",
          userId: "user123",
          options: {
            retry: false,
          },
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.positions).toEqual(mockPositions);
  });

  it("should handle fetch error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Error",
      json: async () => ({
        body: "fail!",
      }),
    });

    const { result } = renderHook(
      () =>
        useOpenPositions({
          businessId: "biz123",
          userId: "user123",
          options: {
            retry: false,
          },
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 10000 },
    );

    expect(result.current.error?.message).toBeTruthy();
    expect(result.current.status).toBe("error");
  });

  it("should not run the query if businessId is missing", async () => {
    const { result } = renderHook(
      () =>
        useOpenPositions({
          userId: "user123",
          businessId: undefined,
        }),
      { wrapper: createWrapper() },
    );

    // Since `enabled` is false, query will stay idle
    expect(result.current.status).toBe("pending");
    expect(result.current.isPending).toBe(true);
    expect(result.current.positions).toEqual([]);
  });

  it("should not run the query if userId is missing", async () => {
    const { result } = renderHook(
      () =>
        useOpenPositions({
          businessId: "biz123",
          userId: undefined,
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.status).toBe("pending");
    expect(result.current.isPending).toBe(true);
    expect(result.current.positions).toEqual([]);
  });
});
