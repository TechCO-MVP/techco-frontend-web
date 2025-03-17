"use server";
import { graphQLClient } from "@/lib/graphql/client";
import { UPDATE_CARD_FIELD } from "@/lib/graphql/mutations";
import { PipefyCard } from "@/types/pipefy";

interface UpdateFieldResponse {
  card: PipefyCard;
}

export async function updateField(data: FormData): Promise<void> {
  const field_id = data.get("field_id") as string;
  const card_id = data.get("card_id") as string;
  const new_value = data.get(field_id) as string;
  try {
    const response = await graphQLClient.request<UpdateFieldResponse>(
      UPDATE_CARD_FIELD,
      {
        input: {
          card_id,
          field_id,
          new_value,
        },
      },
    );

    console.log("GraphQL Response:", response);
  } catch (error) {
    console.error("GraphQL Error:", error);
  }
}
