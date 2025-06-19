import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";
import { MOVE_CARD_TO_PHASE } from "@/lib/graphql/mutations";
import { v4 as uuidv4 } from "uuid";

interface MoveCardInput {
  cardId: string;
  destinationPhaseId: string;
}
interface MoveCardResponse {
  moveCardToPhase: {
    clientMutationId: string;
    card: {
      id: string;
      title: string;
      phase: {
        id: string;
        name: string;
      };
    };
  };
}
export function useMoveCardToPhase(
  options?: UseMutationOptions<MoveCardResponse, Error, MoveCardInput>,
) {
  return useMutation<MoveCardResponse, Error, MoveCardInput>({
    mutationFn: async ({ cardId, destinationPhaseId }) => {
      const clientMutationId = uuidv4();

      const input = {
        clientMutationId,
        card_id: cardId,
        destination_phase_id: destinationPhaseId,
      };

      return await graphQLClient.request<MoveCardResponse>(MOVE_CARD_TO_PHASE, {
        input,
      });
    },
    ...options,
  });
}
