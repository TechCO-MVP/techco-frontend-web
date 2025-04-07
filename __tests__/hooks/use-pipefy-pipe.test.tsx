// __tests__/hooks/use-pipefy-pipe.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePipefyPipe } from "@/hooks/use-pipefy-pipe";
import { graphQLClient } from "@/lib/graphql/client";

// Mock GraphQL client and transformer
vi.mock("@/lib/graphql/client", () => ({
  graphQLClient: {
    request: vi.fn(),
  },
}));

vi.mock("@/lib/pipefy/board-transformer", () => ({
  PipefyBoardTransformer: vi.fn().mockImplementation((data) => ({
    toBoardState: () => ({
      phases: data?.mockPhases || [],
      cardsByPhase: {},
    }),
  })),
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

describe("usePipefyPipe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches board state successfully", async () => {
    const mockResponse = { mockPhases: [{ id: "phase-1", name: "Backlog" }] };
    mockGraphQL.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePipefyPipe({ pipeId: "pipe-123" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.boardState).toEqual({
      phases: mockResponse.mockPhases,
      cardsByPhase: {},
    });

    expect(mockGraphQL).toHaveBeenCalledWith(expect.anything(), {
      pipeId: "pipe-123",
    });
  });

  it("should not run query if pipeId is not provided", async () => {
    const { result } = renderHook(() => usePipefyPipe({}), {
      wrapper: createWrapper(),
    });

    expect(result.current.status).toBe("pending");
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.boardState).toBeUndefined();
    expect(mockGraphQL).not.toHaveBeenCalled();
  });

  it("handles error from GraphQL client", async () => {
    mockGraphQL.mockRejectedValueOnce(new Error("GraphQL Error"));

    const { result } = renderHook(
      () => usePipefyPipe({ pipeId: "pipe-123", options: { retry: false } }),
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
    expect(result.current.error?.message).toBeTruthy();
  });
});
