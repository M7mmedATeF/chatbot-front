import AxiosFetch from "../AxiosFetch";
import {
  CreateMCPMutation,
  UpdateMCPMutation,
  RemoveMCPMutation,
  ListMCPsForWorkspaceMutation,
  type CreateMCPVariables,
  type UpdateMCPVariables,
  type RemoveMCPVariables,
  type ListMCPsForWorkspaceResponse,
} from "./MCP.gql";

export const createMCP = async ({ createMcpInput }: CreateMCPVariables) => {
  const response = await AxiosFetch.post(import.meta.env.VITE_GQL_URL, {
    query: CreateMCPMutation,
    variables: { createMcpInput },
  });

  return response.data;
};

export const updateMCP = async ({ id, updateMcpInput }: UpdateMCPVariables) => {
  const response = await AxiosFetch.post(import.meta.env.VITE_GQL_URL, {
    query: UpdateMCPMutation,
    variables: { id, updateMcpInput },
  });

  return response.data;
};

export const removeMCP = async ({ id }: RemoveMCPVariables) => {
  const response = await AxiosFetch.post(import.meta.env.VITE_GQL_URL, {
    query: RemoveMCPMutation,
    variables: { id },
  });

  return response.data;
};
export const listMCPsForWorkspace =
  async (): Promise<ListMCPsForWorkspaceResponse> => {
    const response = await AxiosFetch.post(import.meta.env.VITE_GQL_URL, {
      query: ListMCPsForWorkspaceMutation,
    });

    return response.data;
  };
