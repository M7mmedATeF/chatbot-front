import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRoomMutation,
  type CreateRoomVariables,
} from "../services/Mutations/Room.gql";
import { toast } from "react-toastify";

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoomMutation,
    onSuccess: (data) => {
      // Invalidate and refetch rooms query to update the list
      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      toast.success("Room created successfully!");
      return data;
    },
    onError: (error: any) => {
      console.error("Failed to create room:", error);
      toast.error(error?.message || "Failed to create room");
    },
  });
};
