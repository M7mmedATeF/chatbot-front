import { useQuery } from "@tanstack/react-query";
import {
  listConfigsQuery,
  type ListConfigsResponse,
} from "../services/Queries/Config.gql";
import { toast } from "react-toastify";

export const useListConfigs = () => {
  return useQuery<ListConfigsResponse>({
    queryKey: ["configs"],
    queryFn: listConfigsQuery,
    onError: (error: any) => {
      console.error("Failed to fetch configs:", error);
      toast.error(error?.message || "Failed to fetch configs");
    },
  });
};
