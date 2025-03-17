import { gql } from "graphql-request";

export const GET_CARD = gql`
  query GetCard($cardId: ID!) {
    card(id: $cardId) {
      pipe {
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
              fields {
                required
                internal_id
                label
                type
                options
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
