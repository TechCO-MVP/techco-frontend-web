import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCreateComment } from "@/hooks/use-create-comment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";
import { act } from "react-dom/test-utils";

// Mock GraphQL client
vi.mock("@/lib/graphql/client", () => ({
  graphQLClient: {
    request: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCreateComment", () => {
  const mockComment = {
    createComment: {
      comment: {
        id: "1",
        text: "Hello world",
        author_name: "Jane Doe",
        created_at: "2024-01-01T00:00:00Z",
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a comment successfully", async () => {
    (graphQLClient.request as any).mockResolvedValueOnce(mockComment);

    const { result } = renderHook(() => useCreateComment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        cardId: "123",
        text: "Hello world",
      });
    });

    // Wait for the mutation to complete and update state
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockComment);
    });

    expect(graphQLClient.request).toHaveBeenCalledWith(expect.anything(), {
      input: { card_id: "123", text: "Hello world" },
    });
  });

  it("should handle mutation error", async () => {
    (graphQLClient.request as any).mockRejectedValueOnce(
      new Error("GraphQL error"),
    );

    const { result } = renderHook(() => useCreateComment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          cardId: "999",
          text: "Fail this",
        });
      } catch {}
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("GraphQL error");
    });
  });
});
