import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignAgentToWorkspaceMutation,
  type AssignWorkspaceAgentInput,
  type AssignAgentToWorkspaceResponse,
} from "../services/Mutations/WorkspaceAgent.service";

export const useAssignAgentToWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AssignAgentToWorkspaceResponse,
    Error,
    AssignWorkspaceAgentInput
  >({
    mutationFn: assignAgentToWorkspaceMutation,
    onSuccess: () => {
      // Invalidate and refetch assign agents query
      queryClient.invalidateQueries({ queryKey: ["assignAgents"] });
    },
  });
};
