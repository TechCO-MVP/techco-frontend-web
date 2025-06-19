import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdatePositionConfiguration } from "@/hooks/use-update-position-configuration";
import { UpdatePositionConfigurationInput } from "@/types";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// React Query wrapper
const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useUpdatePositionConfiguration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPayload = {
    _id: "abc123",
    created_at: "2025-01-01",
    updated_at: "2025-01-02",
    deleted_at: null,
    user_id: "user_123",
    business_id: "biz_456",
    thread_id: "thread_789",
    status: "IN_PROGRESS",
    type: "AI_TEMPLATE",
    phases: [],
  } satisfies UpdatePositionConfigurationInput;

  const mockResponse = {
    ...mockPayload,
  };

  it("successfully updates the position configuration", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useUpdatePositionConfiguration(), {
      wrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/position-configuration/update",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockPayload),
      }),
    );
  });

  it("handles API error with message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Update failed" }),
    });

    const { result } = renderHook(() => useUpdatePositionConfiguration(), {
      wrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Update failed");
  });

  it("handles generic API error without message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useUpdatePositionConfiguration(), {
      wrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(
      "Failed to update configuration",
    );
  });
});
