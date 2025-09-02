import { useQuery } from "@tanstack/react-query";
import { useActiveTeam } from "../stores/team.store";
import { fetchMyRooms } from "../services/Queries/Room.gql";

// Shared hook for rooms data
export const useRooms = () => {
  const { id: activeTeamId } = useActiveTeam();

  return useQuery({
    queryKey: ["rooms", activeTeamId],
    queryFn: () => fetchMyRooms(),
    enabled: !!activeTeamId, // Only run query if teamId is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
