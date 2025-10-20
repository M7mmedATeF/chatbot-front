import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAgentMutation,
  type UpdateAgentInput,
  type UpdateAgentResponse,
} from "../services/Mutations/Agent.service";

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAgentResponse,
    Error,
    { id: number; input: UpdateAgentInput }
  >({
    mutationFn: ({ id, input }) => updateAgentMutation(id, input),
    onSuccess: () => {
      // Invalidate and refetch agents query
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
};
