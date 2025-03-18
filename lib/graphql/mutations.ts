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

export const CONFIGURE_PUBLIC_PHASE_FORM_LINK = `
  mutation ConfigurePublicPhaseFormLink($input: configurePublicPhaseFormLinkInput!) {
    configurePublicPhaseFormLink(input: $input) {
      url
    }
  }
`;

export const CREATE_COMMENT = `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      comment {
        id
        text
        created_at
        author_name
      }
    }
  }
`;

export const UPDATE_CARD_FIELD = `
  mutation UpdateCardField($input: UpdateCardFieldInput!) {
    updateCardField(input: $input) {
      card {
        id
      }
    }
  }
`;

/**
 * 
 * 
  mutation CreateComment {
  createComment(input:{
    card_id: "1076722859",
    text: "Test Comment"
  }) {
    clientMutationId,
    comment
  }
}

 */

/**
 *   mutation UpdateCardField {
  updateCardField(input:{
    card_id: "1076722859",
    field_id: "apodo_del_candidato",
    new_value:"ON24"
  }) {
    card
  }
}
 */
