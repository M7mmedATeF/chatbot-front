import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConfigMutation } from "../services/Mutations/Config.gql";
import { toast } from "react-toastify";

export const useCreateConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConfigMutation,
    onSuccess: (data) => {
      // Invalidate and refetch configs query to update the list
      queryClient.invalidateQueries({ queryKey: ["configs"] });

      toast.success("تم حفظ التكوينات بنجاح!");
      return data;
    },
    onError: (error: any) => {
      console.error("فشل في حفظ التكوينات:", error);
      toast.error(error?.message || "فشل في حفظ التكوينات");
    },
  });
};
