import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changeAgentStatusMutation,
  type ChangeAgentStatusInput,
  type ChangeAgentStatusResponse,
} from "../services/Mutations/Agent.gql";

export const useChangeAgentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<ChangeAgentStatusResponse, Error, ChangeAgentStatusInput>({
    mutationFn: changeAgentStatusMutation,
    onSuccess: () => {
      // Invalidate and refetch agents query
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
};
