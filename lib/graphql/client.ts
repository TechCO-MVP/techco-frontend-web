import { GraphQLClient } from "graphql-request";

export const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_PIPEFY_GRAPHQL_URL!, {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PIPEFY_API_KEY}`,
  },
});
