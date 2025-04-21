import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCreatePositionConfiguration } from "@/hooks/use-create-position-configuration";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostPositionConfigurationInput } from "@/types";

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Setup wrapper with React Query
const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCreatePositionConfiguration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPayload = {
    thread_id: "thread_123",
    status: "COMPLETED",
    type: "AI_TEMPLATE",
    phases: [],
  } satisfies PostPositionConfigurationInput;

  const mockResponse = {
    thread_id: "thread_123",
    status: "COMPLETED",
    type: "AI_TEMPLATE",
    phases: [],
  };

  it("successfully creates a position configuration", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useCreatePositionConfiguration(), {
      wrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/position-configuration/create",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockPayload),
      }),
    );
  });

  it("handles server error correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to create" }),
    });

    const { result } = renderHook(() => useCreatePositionConfiguration(), {
      wrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Failed to create");
  });

  it("handles generic error if no error message is returned", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useCreatePositionConfiguration(), {
      wrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(
      "Failed to create position configuration",
    );
  });
});
