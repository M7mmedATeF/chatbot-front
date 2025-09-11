import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL mutation string
export const CreateWorkspaceMutation = `
mutation CreateWorkspace($createWorkspaceInput: WorkspaceInput!) {
    createWorkspace(createWorkspaceInput: $createWorkspaceInput) {
        id
        name
        createdAt
    }
}
`;

// Types for the mutation
export interface CreateWorkspaceVariables {
  createWorkspaceInput: {
    name: string;
    sys_instruction?: string | null;
  };
}

export interface CreateWorkspaceResponse {
  createWorkspace: {
    id: string;
    name: string;
    createdAt: string;
  };
}

// Mutation function for React Query
export const createWorkspaceMutation = async (
  variables: CreateWorkspaceVariables
): Promise<CreateWorkspaceResponse> => {
  const response = await AxiosFetch.post<ApiResponse<CreateWorkspaceResponse>>(
    "",
    {
      query: CreateWorkspaceMutation,
      variables,
    }
  );

  return response.data.data as CreateWorkspaceResponse;
};

// GraphQL mutation string for team creation
export const CreateTeamMutation = `
mutation CreateTeam($createTeamInput: CreateTeamInput!) {
    createTeam(createTeamInput: $createTeamInput) {
        id
        name
    }
}
`;

// Types for team creation mutation
export interface CreateTeamVariables {
  createTeamInput: {
    name: string;
  };
}

export interface CreateTeamResponse {
  createTeam: {
    id: string;
    name: string;
  };
}

// Mutation function for team creation
export const createTeamMutation = async (
  variables: CreateTeamVariables
): Promise<CreateTeamResponse> => {
  const response = await AxiosFetch.post<ApiResponse<CreateTeamResponse>>("", {
    query: CreateTeamMutation,
    variables,
  });

  return response.data.data as CreateTeamResponse;
};
