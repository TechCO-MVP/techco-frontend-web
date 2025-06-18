import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { graphQLClient } from "@/lib/graphql/client";
import { UPDATE_FIELDS_VALUES } from "@/lib/graphql/mutations";
import { v4 as uuidv4 } from "uuid";

interface UpdateFieldsValuesInput {
  nodeId: string;
  values: {
    fieldId: string;
    value: string;
  }[];
}
interface UpdateFieldsValuesResponse {
  updateFieldsValues: {
    success: boolean;
  };
}
export function useUpdateFieldsValues(
  options?: UseMutationOptions<
    UpdateFieldsValuesResponse,
    Error,
    UpdateFieldsValuesInput
  >,
) {
  return useMutation<
    UpdateFieldsValuesResponse,
    Error,
    UpdateFieldsValuesInput
  >({
    mutationFn: async ({ nodeId, values }) => {
      const clientMutationId = uuidv4();

      const input = {
        clientMutationId,
        nodeId,
        values,
      };

      return await graphQLClient.request<UpdateFieldsValuesResponse>(
        UPDATE_FIELDS_VALUES,
        {
          input,
        },
      );
    },
    ...options,
  });
}
