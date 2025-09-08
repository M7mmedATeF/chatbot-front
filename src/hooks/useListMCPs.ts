import { useQuery } from "@tanstack/react-query";
import {
  listMCPsQuery,
  type ListMCPsResponse,
} from "../services/Queries/MCPs.gql";

export const useListMCPs = () => {
  return useQuery<ListMCPsResponse>({
    queryKey: ["mcps"],
    queryFn: listMCPsQuery,
  });
};
