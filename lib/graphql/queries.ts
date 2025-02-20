import { gql } from "graphql-request";

export const GET_PIPE = gql`
  query GetPipe($pipeId: ID!) {
    pipe(id: $pipeId) {
      id
      name
      phases {
        id
        name
        cards_count
        cards_can_be_moved_to_phases {
          id
          name
        }
        cards {
          nodes {
            id
            fields {
              indexName
              name
              value
            }
          }
        }
      }
    }
  }
`;
