import { renderHook, act, waitFor } from "@testing-library/react";
import { useUploadFile } from "@/hooks/use-file-upload";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("useUploadFile", () => {
  const uploadUrl = "https://mock-storage.com/file.jpg";
  const contentType = "image/jpeg";
  const mockFile = new File(["dummy content"], "file.jpg", {
    type: contentType,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should upload file successfully", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const { result } = renderHook(() => useUploadFile());

    act(() => {
      result.current.uploadFile(uploadUrl, mockFile, contentType);
    });

    await waitFor(() => expect(result.current.uploading).toBe(false));

    expect(mockFetch).toHaveBeenCalledWith(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: mockFile,
    });

    expect(result.current.success).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("should handle upload failure", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const { result } = renderHook(() => useUploadFile());

    act(() => {
      result.current.uploadFile(uploadUrl, mockFile, contentType);
    });

    await waitFor(() => expect(result.current.uploading).toBe(false));

    expect(result.current.success).toBe(false);
    expect(result.current.error).toContain("Upload failed with status 500");
  });

  it("should handle fetch rejection (network error)", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useUploadFile());

    act(() => {
      result.current.uploadFile(uploadUrl, mockFile, contentType);
    });

    await waitFor(() => expect(result.current.uploading).toBe(false));

    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe("Network error");
  });
});
