import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHiringProcess } from "@/hooks/use-hiring-process";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Important to avoid retry delays
        staleTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockHiringProcessData = {
  position_country: "ES",
  position_city: "Madrid",
  position_status: "ACTIVE",
  recruiter_id: "1",
  recruiter_name: "John Doe",
  owner_id: "2",
  owner_name: "Jane Doe",
  stakeholders: [],
};

describe("useHiringProcess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch hiring process data successfully", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          body: {
            data: mockHiringProcessData,
          },
        }),
        { status: 200, statusText: "OK" },
      ),
    );

    const { result } = renderHook(
      () => useHiringProcess({ hiringProcessId: "123" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hiringProcess).toEqual(mockHiringProcessData);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/hiring-process?hiring_process_id=123",
    );
  });

  it("should throw error if hiringProcessId is missing", async () => {
    const { result } = renderHook(
      // @ts-expect-error for testing missing param
      () => useHiringProcess({}),
      { wrapper: createWrapper() },
    );

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toMatch(/Missing required parameter/);
  });

  it("should handle a failed fetch", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(null, {
        status: 500,
        statusText: "Internal Server Error",
      }),
    );

    const { result } = renderHook(
      () => useHiringProcess({ hiringProcessId: "456" }),
      { wrapper: createWrapper() },
    );

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBeTruthy();
  });

  it("should handle unexpected API format", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        body: "fail!",
      }),
    });

    const { result } = renderHook(
      () => useHiringProcess({ hiringProcessId: "789" }),
      { wrapper: createWrapper() },
    );

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 2000 },
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toMatch(/Unexpected API response/);
  });
});
