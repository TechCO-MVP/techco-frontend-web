import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateField } from "@/actions";
import { graphQLClient } from "@/lib/graphql/client";
import { PipefyFieldType } from "@/types/pipefy";

// Mock the graphQLClient.request method
vi.mock("@/lib/graphql/client", () => ({
  graphQLClient: {
    request: vi.fn(),
  },
}));

const mockRequest = graphQLClient.request as unknown as ReturnType<
  typeof vi.fn
>;

describe("updateField", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update a regular field successfully", async () => {
    const mockResponse = {
      success: true,
      updateCardField: {
        card: {
          id: "card-1",
        },
      },
    };

    mockRequest.mockResolvedValueOnce(mockResponse);

    const formData = new FormData();
    formData.set("card_id", "card-1");
    formData.set("field_id", "field-123");
    formData.set("field-123", "New value");
    formData.set("type", "short_text");

    const result = await updateField(formData);

    expect(mockRequest).toHaveBeenCalledWith(expect.anything(), {
      input: {
        card_id: "card-1",
        field_id: "field-123",
        new_value: "New value",
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it("should handle attachment fields as an array", async () => {
    const mockResponse = {
      success: true,
      updateCardField: {
        card: {
          id: "card-2",
        },
      },
    };

    mockRequest.mockResolvedValueOnce(mockResponse);

    const formData = new FormData();
    formData.set("card_id", "card-2");
    formData.set("field_id", "attachment-1");
    formData.set("attachment-1", "https://image.url");
    formData.set("type", "attachment" satisfies PipefyFieldType);

    const result = await updateField(formData);

    expect(mockRequest).toHaveBeenCalledWith(expect.anything(), {
      input: {
        card_id: "card-2",
        field_id: "attachment-1",
        new_value: ["https://image.url"],
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it("should return a failure response on GraphQL error", async () => {
    mockRequest.mockRejectedValueOnce(new Error("GraphQL error"));

    const formData = new FormData();
    formData.set("card_id", "card-3");
    formData.set("field_id", "field-err");
    formData.set("field-err", "Fail this");
    formData.set("type", "short_text");

    const result = await updateField(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Failed to update the field");
  });
});
