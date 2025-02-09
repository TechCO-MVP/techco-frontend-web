import { gql } from "graphql-request";

export const GET_PIPE = gql`
  query GetPipe($pipeId: ID!) {
    pipe(id: $pipeId) {
      id
      phases {
        id
        name
        cards_count
        cards {
          nodes {
            fields {
              name
              native_value
              indexName
            }
          }
        }
      }
    }
  }
`;
