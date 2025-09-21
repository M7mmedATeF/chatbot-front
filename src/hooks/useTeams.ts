import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "../services/Queries/Teams.gql";
import { useActiveWorkspace } from "../stores/workspace.store";

// Shared hook for current user's teams data
export const useTeams = () => {
  const { id: activeWorkspaceId } = useActiveWorkspace();

  return useQuery({
    queryKey: ["my-teams", activeWorkspaceId],
    queryFn: fetchTeams,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
