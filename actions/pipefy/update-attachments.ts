"use server";
import { graphQLClient } from "@/lib/graphql/client";
import { UPDATE_CARD_FIELD } from "@/lib/graphql/mutations";
import { PipefyCard } from "@/types/pipefy";
import { CERTIFICATES_FIELD_ID } from "@/constants";

interface UpdateFieldResponse {
  updateCardField?: {
    card: PipefyCard;
  };
  success: boolean;
  message?: string;
}

export async function updateAttachments(
  cardId: string,
  attachments: string[],
): Promise<UpdateFieldResponse> {
  try {
    const response = await graphQLClient.request<UpdateFieldResponse>(
      UPDATE_CARD_FIELD,
      {
        input: {
          card_id: cardId,
          field_id: CERTIFICATES_FIELD_ID,
          new_value: attachments,
        },
      },
    );
    console.log("updateAttachments response", response);
    return response;
  } catch (error) {
    console.error("GraphQL Error:", error);
    return {
      success: false,
      message: "Failed to update the attachments",
    };
  }
}
