import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMoveCardToPhase } from "@/hooks/use-move-card-to-phase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";
import { MOVE_CARD_TO_PHASE } from "@/lib/graphql/mutations";

// Mock UUID and GraphQL client
vi.mock("uuid", () => ({
  v4: () => "mock-client-mutation-id",
}));

vi.mock("@/lib/graphql/client", () => ({
  graphQLClient: {
    request: vi.fn(),
  },
}));

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

describe("useMoveCardToPhase", () => {
  const mockResponse = {
    moveCardToPhase: {
      clientMutationId: "mock-client-mutation-id",
      card: {
        id: "card-123",
        title: "Sample Card",
        phase: {
          id: "phase-456",
          name: "In Progress",
        },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should move a card to a new phase successfully", async () => {
    vi.mocked(graphQLClient.request).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useMoveCardToPhase(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      cardId: "card-123",
      destinationPhaseId: "phase-456",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(graphQLClient.request).toHaveBeenCalledWith(MOVE_CARD_TO_PHASE, {
      input: {
        clientMutationId: "mock-client-mutation-id",
        card_id: "card-123",
        destination_phase_id: "phase-456",
      },
    });
  });

  it("should handle error when mutation fails", async () => {
    vi.mocked(graphQLClient.request).mockRejectedValueOnce(
      new Error("Mutation failed"),
    );

    const { result } = renderHook(() => useMoveCardToPhase(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      cardId: "card-123",
      destinationPhaseId: "phase-456",
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBeTruthy();
  });
});
