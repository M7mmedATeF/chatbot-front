import { useQuery } from "@tanstack/react-query";
import {
  listAgentsQuery,
  type ListAgentsResponse,
} from "../services/Queries/Agents.gql";

export const useAgents = () => {
  return useQuery<ListAgentsResponse>({
    queryKey: ["agents"],
    queryFn: listAgentsQuery,
  });
};
