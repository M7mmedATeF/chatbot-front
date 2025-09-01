import { useQuery } from "@tanstack/react-query";
import { fetchMyWorkspaces } from "../services/Queries/Workspaces.gql";

// Shared hook for workspaces data
export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchMyWorkspaces,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
