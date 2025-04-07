// __tests__/hooks/use-pipefy-card.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePipefyCard } from "@/hooks/use-pipefy-card";
import { graphQLClient } from "@/lib/graphql/client";

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

describe("usePipefyCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches card data successfully", async () => {
    const mockCardData = {
      card: {
        pipe: {
          phases: [
            { id: "phase-1", name: "Backlog" },
            { id: "phase-2", name: "In Progress" },
          ],
        },
      },
    };

    mockGraphQL.mockResolvedValueOnce(mockCardData);

    const { result } = renderHook(() => usePipefyCard({ cardId: "card-123" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.card).toEqual(mockCardData.card);
    expect(mockGraphQL).toHaveBeenCalledWith(expect.anything(), {
      cardId: "card-123",
    });
  });

  it("does not run query if cardId is not provided", async () => {
    const { result } = renderHook(() => usePipefyCard({}), {
      wrapper: createWrapper(),
    });

    expect(result.current.status).toBe("pending");
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.card).toBeUndefined();
    expect(mockGraphQL).not.toHaveBeenCalled();
  });

  it("handles GraphQL error properly", async () => {
    mockGraphQL.mockRejectedValueOnce(new Error("GraphQL Error"));

    const { result } = renderHook(() => usePipefyCard({ cardId: "card-123" }), {
      wrapper: createWrapper(),
    });

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
