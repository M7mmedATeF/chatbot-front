import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createWorkspaceMcp,
  removeWorkspaceMcp,
  updateWorkspaceMcp,
} from "../services/Mutations/Workspace.gql";

export const useAssignMcp = () => {
  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: createWorkspaceMcp,
    onSuccess: () => {
      // إعادة تحديث البيانات بعد التعيين الناجح
      queryClient.invalidateQueries({
        queryKey: ["availableWsMcps"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspaceMcps"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: removeWorkspaceMcp,
    onSuccess: () => {
      // إعادة تحديث البيانات بعد الحذف الناجح
      queryClient.invalidateQueries({
        queryKey: ["availableWsMcps"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspaceMcps"],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateWorkspaceMcp,
    onSuccess: () => {
      // إعادة تحديث البيانات بعد التحديث الناجح
      queryClient.invalidateQueries({
        queryKey: ["availableWsMcps"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspaceMcps"],
      });
    },
  });

  return {
    assignMutation,
    deleteMutation,
    updateMutation,
  };
};
