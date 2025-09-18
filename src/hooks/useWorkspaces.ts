import { useQuery } from "@tanstack/react-query";
import {
  fetchMyWorkspaces,
  fetchAvailableWsMcps,
  fetchWorkspaceMcps,
  type ListAvailableWsMcpsResponse,
  type WorkspaceMcpResponse,
} from "../services/Queries/Workspaces.gql";

// Shared hook for workspaces data
export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchMyWorkspaces,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for available workspace MCPs
export const useAvailableWsMcps = () => {
  return useQuery<ListAvailableWsMcpsResponse>({
    queryKey: ["availableWsMcps"],
    queryFn: fetchAvailableWsMcps,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for current workspace MCPs
export const useWorkspaceMcps = () => {
  return useQuery<WorkspaceMcpResponse>({
    queryKey: ["workspaceMcps"],
    queryFn: fetchWorkspaceMcps,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
