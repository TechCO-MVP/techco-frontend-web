import { renderHook, waitFor } from "@testing-library/react";
import { useUsers } from "@/hooks/use-users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests
        staleTime: 0,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useUsers Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return users on a successful API call", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        body: {
          data: [
            { id: 1, name: "User 1" },
            { id: 2, name: "User 2" },
          ],
        },
      }),
    });

    const { result } = renderHook(() => useUsers({ businessId: "123" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.users).toHaveLength(2);
    });

    expect(result.current.users).toEqual([
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
    ]);
  });

  it("should handle userId and return a single user", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        body: {
          data: [{ id: 1, name: "User 1" }],
        },
      }),
    });

    const { result } = renderHook(
      () => useUsers({ businessId: "123", userId: "1" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.users).toHaveLength(1);
    });

    expect(result.current.users).toEqual([{ id: 1, name: "User 1" }]);
  });

  it("should handle query parameter `all` and fetch all users", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        body: {
          data: [
            { id: 1, name: "User 1" },
            { id: 2, name: "User 2" },
            { id: 3, name: "User 3" },
          ],
        },
      }),
    });

    const { result } = renderHook(
      () => useUsers({ businessId: "123", all: true }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.users).toHaveLength(3);
    });

    expect(result.current.users).toEqual([
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
      { id: 3, name: "User 3" },
    ]);
  });
});
