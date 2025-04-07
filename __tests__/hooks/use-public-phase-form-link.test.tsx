// __tests__/hooks/use-public-phase-form-link.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePublicPhaseFormLink } from "@/hooks/use-public-phase-form-link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";

// Mock the UUID
vi.mock("uuid", () => ({
  v4: () => "mock-client-mutation-id",
}));

// Mock GraphQL client
vi.mock("@/lib/graphql/client", () => ({
  graphQLClient: {
    request: vi.fn(),
  },
}));

const mockRequest = graphQLClient.request as unknown as ReturnType<
  typeof vi.fn
>;

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePublicPhaseFormLink", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully configures the public phase form link", async () => {
    const mockResponse = {
      configurePublicPhaseFormLink: {
        url: "https://example.com/public-form-link",
      },
    };

    mockRequest.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePublicPhaseFormLink(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      cardId: "card-123",
      enable: true,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockRequest).toHaveBeenCalledWith(expect.anything(), {
      input: {
        clientMutationId: "mock-client-mutation-id",
        cardId: "card-123",
        enable: true,
      },
    });

    expect(result.current.data).toEqual(mockResponse);
  });

  it("handles mutation error", async () => {
    const error = new Error("GraphQL error");

    mockRequest.mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePublicPhaseFormLink(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      cardId: "card-456",
      enable: false,
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error).toBe(error);
  });
});
