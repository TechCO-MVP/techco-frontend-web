import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";
import { CREATE_PRESIGNED_URL } from "@/lib/graphql/mutations";
import { v4 as uuidv4 } from "uuid";

interface CreatePresignedUrlInput {
  fileName: string;
  organizationId: string;
}
interface CreatePresignedUrlResponse {
  createPresignedUrl: {
    url: string;
  };
}
export function usePresignedUrl(
  options?: UseMutationOptions<
    CreatePresignedUrlResponse,
    Error,
    CreatePresignedUrlInput
  >,
) {
  return useMutation<
    CreatePresignedUrlResponse,
    Error,
    CreatePresignedUrlInput
  >({
    mutationFn: async ({ fileName, organizationId }) => {
      const input = {
        fileName: fileName,
        organizationId: organizationId,
      };

      return await graphQLClient.request<CreatePresignedUrlResponse>(
        CREATE_PRESIGNED_URL,
        {
          input,
        },
      );
    },
    ...options,
  });
}
