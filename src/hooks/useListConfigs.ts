import { useQuery } from "@tanstack/react-query";
import {
  listConfigsQuery,
  type ListConfigsResponse,
} from "../services/Queries/Config.gql";

export const useListConfigs = () => {
  return useQuery<ListConfigsResponse>({
    queryKey: ["configs"],
    queryFn: listConfigsQuery,
  });
};
