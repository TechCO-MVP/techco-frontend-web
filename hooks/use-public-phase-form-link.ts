import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";
import { CONFIGURE_PUBLIC_PHASE_FORM_LINK } from "@/lib/graphql/mutations";
import { v4 as uuidv4 } from "uuid";

interface ConfigurePublicPhaseFormLinkInput {
  cardId: string;
  enable: boolean;
}
interface ConfigurePublicPhaseFormLinkResponse {
  configurePublicPhaseFormLink: {
    url: string;
  };
}
export function usePublicPhaseFormLink(
  options?: UseMutationOptions<
    ConfigurePublicPhaseFormLinkResponse,
    Error,
    ConfigurePublicPhaseFormLinkInput
  >,
) {
  return useMutation<
    ConfigurePublicPhaseFormLinkResponse,
    Error,
    ConfigurePublicPhaseFormLinkInput
  >({
    mutationFn: async ({ cardId, enable }) => {
      const clientMutationId = uuidv4();

      const input = {
        clientMutationId,
        cardId,
        enable,
      };

      return await graphQLClient.request<ConfigurePublicPhaseFormLinkResponse>(
        CONFIGURE_PUBLIC_PHASE_FORM_LINK,
        {
          input,
        },
      );
    },
    ...options,
  });
}
