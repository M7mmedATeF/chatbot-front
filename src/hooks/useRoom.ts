import { useQuery } from "@tanstack/react-query";
import { fetchRoom } from "../services/Queries/Room.gql";

// Hook for fetching room details with messages
export const useRoom = (roomId: number | undefined) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: () => fetchRoom({ id: roomId! }),
    enabled: !!roomId && roomId > 0, // Only run query if roomId is a valid number
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
