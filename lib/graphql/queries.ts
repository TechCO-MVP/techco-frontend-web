import { gql } from "graphql-request";

export const GET_CARD = gql`
  query GetCard($cardId: ID!) {
    card(id: $cardId) {
      attachments {
        url
        createdAt
        field {
          id
          index_name
        }
      }
      current_phase {
        id
        name
        fields {
          description
          type
        }
      }
      fields {
        name
        value
        indexName
        field {
          id
          type
          internal_id
        }
      }
      pipe {
        id
        organizationId
        phases {
          id
          name
        }
      }
    }
  }
`;

export const GET_PIPES = gql`
  query GetPipes($ids: [ID]!) {
    pipes(ids: $ids) {
      id
      cards_count
      phases {
        name
        cards_count
      }
    }
  }
`;
export const GET_PIPE = gql`
  query GetPipe($pipeId: ID!) {
    pipe(id: $pipeId) {
      organizationId
      cards_count
      id
      name
      startFormPhaseId
      publicForm {
        url
      }
      phases {
        id
        name
        cards_count
        next_phase_ids
        previous_phase_ids
        fields {
          id
          options
          required
          internal_id
          type
        }
        cards_can_be_moved_to_phases {
          id
          name
        }
        cards {
          nodes {
            attachments {
              url
              createdAt
            }
            phases_history {
              duration
              lastTimeIn
              phase {
                id
                name
                fields {
                  id
                  internal_id
                  label
                  type
                  options
                }
              }
            }
            current_phase {
              id
              name
              fields {
                required
                internal_id
                label
                type
                options
                description
              }
              fieldConditions {
                actions {
                  whenEvaluator
                  phaseField {
                    internal_id
                  }
                }
                condition {
                  expressions {
                    field_address
                    operation
                    structure_id
                    value
                  }
                }
              }
            }
            comments {
              author_name
              created_at
              id
              text
            }
            id
            fields {
              phase_field {
                required
                internal_id
                type
                options
              }
              indexName
              name
              value
              filled_at
              field {
                type
                options
              }
            }
          }
        }
      }
    }
  }
`;

// query MyQuery {
//   pipe(id: "305713420") {
//     startFormPhaseId
//     phases {
//       cards {
//         nodes {
//           fields {
//             value
//             phase_field {
//               internal_id
//               type
//               options
//               phase {
//                 name
//                 id
//               }
//             }
//           }
//           title
//           phases_history {
//             phase {
//               id
//               fields {
//                 internal_id
//                 label
//                 type
//               }
//             }
//             duration
//             lastTimeIn
//           }
//         }
//       }
//     }
//     publicForm {
//       url
//       id
//     }
//   }
// }
