import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  removeWorkspaceAgentMutation,
  type RemoveWorkspaceAgentInput,
  type RemoveWorkspaceAgentResponse,
} from "../services/Mutations/WorkspaceAgent.service";

export const useRemoveAgentFromWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RemoveWorkspaceAgentResponse,
    Error,
    RemoveWorkspaceAgentInput
  >({
    mutationFn: removeWorkspaceAgentMutation,
    onSuccess: () => {
      // Invalidate and refetch assign agents query
      queryClient.invalidateQueries({ queryKey: ["assignAgents"] });
    },
  });
};

