import { renderHook, waitFor } from "@testing-library/react";
import { useBusinesses } from "@/hooks/use-businesses";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useBusinesses Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return businesses and root business on successful API call", async () => {
    const mockApiResponse = {
      body: [
        { id: 1, name: "Business A", parent_business_id: null },
        { id: 2, name: "Business B", parent_business_id: 1 },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    const { result } = renderHook(() => useBusinesses(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.businesses).toEqual(mockApiResponse.body);
    expect(result.current.rootBusiness).toEqual(mockApiResponse.body[0]);
  });

  it("should return an empty businesses array and null root business on no data", async () => {
    const mockEmptyResponse = {
      body: [],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmptyResponse,
    });

    const { result } = renderHook(() => useBusinesses(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.businesses).toEqual([]);
    expect(result.current.rootBusiness).toBeNull();
  });
});
