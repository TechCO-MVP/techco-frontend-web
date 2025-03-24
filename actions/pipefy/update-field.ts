"use server";
import { graphQLClient } from "@/lib/graphql/client";
import { UPDATE_CARD_FIELD } from "@/lib/graphql/mutations";
import { PipefyCard, PipefyFieldType } from "@/types/pipefy";

interface UpdateFieldResponse {
  updateCardField?: {
    card: PipefyCard;
  };
  success: boolean;
  message?: string;
}

export async function updateField(
  data: FormData,
): Promise<UpdateFieldResponse> {
  const field_id = data.get("field_id") as string;
  const card_id = data.get("card_id") as string;
  const new_value = data.get(field_id) as string;
  const type = data.get("type") as PipefyFieldType;
  try {
    const response = await graphQLClient.request<UpdateFieldResponse>(
      UPDATE_CARD_FIELD,
      {
        input: {
          card_id,
          field_id,
          new_value: type === "attachment" ? [new_value] : new_value,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("GraphQL Error:", error);
    return {
      success: false,
      message: "Failed to update the field",
    };
  }
}
