import { gql } from "graphql-request";

export const MOVE_CARD_TO_PHASE = gql`
  mutation MoveCardToPhase($input: MoveCardToPhaseInput!) {
    moveCardToPhase(input: $input) {
      card {
        id
        title
      }
    }
  }
`;
