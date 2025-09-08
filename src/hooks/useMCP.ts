import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useListMCPs } from "./useListMCPs";
import {
  createMCP,
  updateMCP,
  removeMCP,
} from "../services/Mutations/MCP.service";
import type {
  CreateMCPInput,
  UpdateMCPInput,
} from "../services/Mutations/MCP.gql";
import type { MCPItem } from "../services/Queries/MCPs.gql";

export interface UseMCPReturn {
  // List operations
  mcps: MCPItem[] | undefined;
  isLoadingList: boolean;
  listError: Error | null;
  refetch: () => void;

  // Create operations
  createMCPAsync: (data: CreateMCPInput) => Promise<any>;
  isCreating: boolean;
  createError: Error | null;

  // Update operations
  updateMCPAsync: (id: number, data: UpdateMCPInput) => Promise<any>;
  isUpdating: boolean;
  updateError: Error | null;

  // Delete operations
  deleteMCPAsync: (id: number) => Promise<any>;
  isDeleting: boolean;
  deleteError: Error | null;
}

export const useMCP = (): UseMCPReturn => {
  const queryClient = useQueryClient();

  // List MCPs
  const {
    data: mcpsData,
    isLoading: isLoadingList,
    error: listError,
    refetch,
  } = useListMCPs();

  // Create MCP mutation
  const createMutation = useMutation({
    mutationFn: createMCP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mcps"] });
    },
  });

  // Update MCP mutation
  const updateMutation = useMutation({
    mutationFn: updateMCP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mcps"] });
    },
  });

  // Delete MCP mutation
  const deleteMutation = useMutation({
    mutationFn: removeMCP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mcps"] });
    },
  });

  // Wrapper functions with proper typing
  const createMCPAsync = async (data: CreateMCPInput) => {
    return createMutation.mutateAsync({ createMcpInput: data });
  };

  const updateMCPAsync = async (id: number, data: UpdateMCPInput) => {
    return updateMutation.mutateAsync({ id, updateMcpInput: data });
  };

  const deleteMCPAsync = async (id: number) => {
    return deleteMutation.mutateAsync({ id });
  };

  return {
    // List operations
    mcps: mcpsData?.mcps,
    isLoadingList,
    listError,
    refetch,

    // Create operations
    createMCPAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Update operations
    updateMCPAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    // Delete operations
    deleteMCPAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
