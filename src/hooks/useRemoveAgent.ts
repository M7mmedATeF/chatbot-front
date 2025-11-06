import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  removeAgentMutation,
  type RemoveAgentInput,
  type RemoveAgentResponse,
} from "../services/Mutations/Agent.service";

export const useRemoveAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<RemoveAgentResponse, Error, RemoveAgentInput>({
    mutationFn: removeAgentMutation,
    onSuccess: () => {
      // Invalidate and refetch agents query
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
};

