import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mocks
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // Avoid retrying failed fetches
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePositionConfigurations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches position configurations successfully", async () => {
    const mockData = {
      message: "position configuration found successfully.",
      body: {
        data: {
          _id: "abc123",
          created_at: "2025-03-28T18:00:00.000Z",
          updated_at: "2025-03-28T18:00:00.000Z",
          deleted_at: null,
          user_id: "user1",
          thread_id: "thread1",
          status: "COMPLETED",
          type: "AI_TEMPLATE",
          phases: [],
        },
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(
      () =>
        usePositionConfigurations({
          options: {
            retry: false,
          },
        }),
      {
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it("adds correct query params", async () => {
    const mockData = { body: { data: {} }, message: "ok" };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(
      () =>
        usePositionConfigurations({
          id: "xyz",
          all: true,
          options: {
            retry: false,
          },
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("id=xyz");
    expect(calledUrl).toContain("all=true");
  });

  it("handles error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Something went wrong" }),
    });

    const { result } = renderHook(
      () =>
        usePositionConfigurations({
          options: {
            retry: false,
          },
        }),
      {
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain("Something went wrong");
  });

  it("returns loading state initially", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ body: { data: {} }, message: "ok" }),
    });

    const { result } = renderHook(
      () =>
        usePositionConfigurations({
          options: {
            retry: false,
          },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
