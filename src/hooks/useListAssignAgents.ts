import { useQuery } from "@tanstack/react-query";
import {
  listAssignAgentsQuery,
  type ListAssignAgentsResponse,
} from "../services/Queries/WorkspaceAgents.gql";

export const useListAssignAgents = () => {
  return useQuery<ListAssignAgentsResponse>({
    queryKey: ["assignAgents"],
    queryFn: listAssignAgentsQuery,
  });
};
