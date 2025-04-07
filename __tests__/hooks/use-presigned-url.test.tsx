// __tests__/hooks/use-presigned-url.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePresignedUrl } from "@/hooks/use-presigned-url";
import { graphQLClient } from "@/lib/graphql/client";

// Mock the graphQLClient
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
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePresignedUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully returns a presigned URL", async () => {
    const mockResponse = {
      createPresignedUrl: {
        url: "https://s3.amazonaws.com/some-url",
      },
    };

    mockGraphQL.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePresignedUrl(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      fileName: "file.jpg",
      organizationId: "org123",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockGraphQL).toHaveBeenCalledWith(expect.anything(), {
      input: { fileName: "file.jpg", organizationId: "org123" },
    });
  });

  it("handles error responses", async () => {
    mockGraphQL.mockRejectedValueOnce(new Error("Something went wrong"));

    const { result } = renderHook(() => usePresignedUrl(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      result.current.mutate({ fileName: "fail.jpg", organizationId: "org123" });
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toMatch(/something went wrong/i);
  });
});
