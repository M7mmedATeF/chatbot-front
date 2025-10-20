import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAgentMutation,
  type CreateAgentInput,
  type CreateAgentResponse,
} from "../services/Mutations/Agent.service";

export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateAgentResponse, Error, CreateAgentInput>({
    mutationFn: createAgentMutation,
    onSuccess: () => {
      // Invalidate and refetch agents query
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
};
