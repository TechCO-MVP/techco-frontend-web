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

export const UPDATE_FIELDS_VALUES = gql`
  mutation UpdateFieldsValues($input: UpdateFieldsValuesInput!) {
    updateFieldsValues(input: $input) {
      success
    }
  }
`;

export const CREATE_PRESIGNED_URL = gql`
  mutation CreatePresignedUrl($input: CreatePresignedUrlInput!) {
    createPresignedUrl(input: $input) {
      url
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

/**
 * 
 * mutation {
  updateFieldsValues(input: {
    nodeId: "1160646375",
    values: [
      {fieldId: "305713420_334105217_candidateemail", value: "mail2@mail.com"},
      {fieldId: "305713420_334105217_rolealignment" value: "Alta"}
    ]
  }) {
    success
  }
}
 */
