// __tests__/hooks/use-pipefy-pipes.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePipefyPipes } from "@/hooks/use-pipefy-pipes";
import { graphQLClient } from "@/lib/graphql/client";

// Mock GraphQL client
vi.mock("@/lib/graphql/client", () => ({
  graphQLClient: {
    request: vi.fn(),
  },
}));

const mockGraphQL = graphQLClient.request as unknown as ReturnType<
  typeof vi.fn
>;

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

describe("usePipefyPipes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches pipes successfully", async () => {
    const mockResponse = {
      pipes: [
        {
          id: "1",
          cards_count: 10,
          phases: [
            { name: "Backlog", cards_count: 4 },
            { name: "In Progress", cards_count: 6 },
          ],
        },
      ],
    };

    mockGraphQL.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePipefyPipes({ ids: ["1"] }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.pipes).toEqual(mockResponse.pipes);
    expect(mockGraphQL).toHaveBeenCalledWith(expect.anything(), {
      ids: ["1"],
    });
  });

  it("does not run the query when no ids are provided", async () => {
    const { result } = renderHook(() => usePipefyPipes({}), {
      wrapper: createWrapper(),
    });

    expect(result.current.status).toBe("pending");
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.pipes).toBeUndefined();
    expect(mockGraphQL).not.toHaveBeenCalled();
  });

  it("handles GraphQL errors gracefully", async () => {
    mockGraphQL.mockRejectedValueOnce(new Error("GraphQL Error"));

    const { result } = renderHook(
      () => usePipefyPipes({ ids: ["1"], options: { retry: false } }),
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

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBeTruthy();
  });
});
