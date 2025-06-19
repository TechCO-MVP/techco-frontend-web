import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";
import { CREATE_COMMENT } from "@/lib/graphql/mutations";

import { PipefyComment } from "@/types/pipefy";

interface CreateCommentInput {
  cardId: string;
  text: string;
}
interface CreateCommentResponse {
  createComment: {
    comment: PipefyComment;
  };
}
export function useCreateComment(
  options?: UseMutationOptions<
    CreateCommentResponse,
    Error,
    CreateCommentInput
  >,
) {
  return useMutation<CreateCommentResponse, Error, CreateCommentInput>({
    mutationFn: async ({ cardId, text }) => {
      const input = {
        card_id: cardId,
        text,
      };

      return await graphQLClient.request<CreateCommentResponse>(
        CREATE_COMMENT,
        {
          input,
        },
      );
    },
    ...options,
  });
}
