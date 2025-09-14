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

// GraphQL mutation string for workspace update
export const UpdateWorkspaceMutation = `
mutation UpdateWorkspace($updateWorkspaceInput: WorkspaceInput!) {
    updateWorkspace(updateWorkspaceInput: $updateWorkspaceInput) {
        id
        name
        sys_instruction
        createdAt
        userRole
    }
}
`;

// Types for the update workspace mutation
export interface UpdateWorkspaceVariables {
  updateWorkspaceInput: {
    name: string;
    sys_instruction?: string | null;
  };
}

export interface UpdateWorkspaceResponse {
  updateWorkspace: {
    id: string;
    name: string;
    sys_instruction: string | null;
    createdAt: string;
    userRole: string;
  };
}

// Mutation function for workspace update
export const updateWorkspaceMutation = async (
  variables: UpdateWorkspaceVariables
): Promise<UpdateWorkspaceResponse> => {
  const response = await AxiosFetch.post<ApiResponse<UpdateWorkspaceResponse>>(
    "",
    {
      query: UpdateWorkspaceMutation,
      variables,
    }
  );

  return response.data.data as UpdateWorkspaceResponse;
};

// GraphQL mutation string for creating workspace MCP
export const CreateWorkspaceMcpMutation = `
mutation CreateWorkspaceMcp($createWorkspaceMcpInput: CreateWorkspaceMcpInput!) {
    createWorkspaceMcp(createWorkspaceMcpInput: $createWorkspaceMcpInput) {
        id
        Mcp {
            id
            name
            path
            icon
            description
            version
            createdAt
            updatedAt
        }
        Workspace {
            id
            name
            sys_instruction
            createdAt
            userRole
        }
        Tools {
            id
            name
            description
            examples
            createdAt
            updatedAt
        }
    }
}
`;

// Types for the create workspace MCP mutation
export interface EnvVariable {
  key: string;
  value: string;
}

export interface CreateWorkspaceMcpVariables {
  createWorkspaceMcpInput: {
    mcpId: number;
    toolsIds: number[];
    env: EnvVariable[];
  };
}

export interface CreateWorkspaceMcpResponse {
  createWorkspaceMcp: {
    id: number;
    Mcp: {
      id: number;
      name: string;
      path: string;
      icon: string;
      description: string;
      version: string;
      createdAt: string;
      updatedAt: string;
    };
    Workspace: {
      id: string;
      name: string;
      sys_instruction: string | null;
      createdAt: string;
      userRole: string;
    };
    Tools: {
      id: number;
      name: string;
      description: string;
      examples: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

// Mutation function for creating workspace MCP
export const createWorkspaceMcpMutation = async (
  variables: CreateWorkspaceMcpVariables
): Promise<CreateWorkspaceMcpResponse> => {
  const response = await AxiosFetch.post<
    ApiResponse<CreateWorkspaceMcpResponse>
  >("", {
    query: CreateWorkspaceMcpMutation,
    variables,
  });

  return response.data.data as CreateWorkspaceMcpResponse;
};
