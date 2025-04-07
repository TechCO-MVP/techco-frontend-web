import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCurrentUser } from "@/hooks/use-current-user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock global fetch
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

describe("useCurrentUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });
  it("should fetch and return current user data successfully", async () => {
    const mockUser = {
      name: "John Doe",
      email: "john@example.com",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        body: {
          user: mockUser,
        },
      }),
    });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.currentUser).toEqual(mockUser);
    expect(mockFetch).toHaveBeenCalledWith("/api/current-user");
  });

  it("should handle an error response from the API", async () => {
    // Make sure the mock is properly set up
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: "Something went wrong" }), {
          status: 500,
          statusText: "Internal Server Error",
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    // Wait for the query to transition to error state
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    // Once we know isError is true, we can check the other error properties
    expect(result.current.status).toBe("error");
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBeTruthy();
  });

  it("should return null if user data is missing", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        body: {}, // No `user`
      }),
    });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.currentUser).toBe(null);
  });
});
