import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL query string

export type EmployeeRole = "OWNER" | "EMPLOYEE" | "MANAGER";

export const MyWorkspacesQuery = `
query MyWorkspaces {
    myWorkspaces {
        id
        name
        createdAt
        userRole
    }
}
`;

// Types for the query response
export interface GraphQLWorkspace {
  id: string;
  name: string;
  createdAt: string;
  userRole: EmployeeRole;
}

export interface MyWorkspacesResponse {
  myWorkspaces: GraphQLWorkspace[];
}

// Query function using AxiosFetch
export const fetchMyWorkspaces = async (): Promise<MyWorkspacesResponse> => {
  const response = await AxiosFetch.post<ApiResponse<MyWorkspacesResponse>>(
    "",
    {
      query: MyWorkspacesQuery,
    }
  );

  return response.data.data as MyWorkspacesResponse;
};

// GraphQL query for single workspace
export const WorkspaceQuery = `
query Workspace {
    workspace {
        createdAt
        id
        name
        sys_instruction
    }
}
`;

// Types for the single workspace query response
export interface WorkspaceResponse {
  workspace: {
    id: string;
    name: string;
    sys_instruction: string | null;
    createdAt: string;
  };
}

// Query function for fetching single workspace
export const fetchWorkspace = async (): Promise<WorkspaceResponse> => {
  const response = await AxiosFetch.post<ApiResponse<WorkspaceResponse>>("", {
    query: WorkspaceQuery,
  });

  return response.data.data as WorkspaceResponse;
};

// GraphQL query for listing available workspace MCPs
export const ListAvailableWsMcpsQuery = `
query ListAvailableWsMcps {
    listAvailableWsMcps {
        id
        name
        path
        icon
        description
        version
        createdAt
        updatedAt
        Tools {
            id
            name
            description
            examples
            createdAt
            updatedAt
        }
        Requirements {
            id
            key
        }
        Env {
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

// Types for the list available workspace MCPs query response
export interface AvailableWsMcpItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  description: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  Tools: {
    id: number;
    name: string;
    description: string;
    examples: string;
    createdAt: string;
    updatedAt: string;
  }[];
  Requirements: {
    id: number;
    key: string;
  }[];
  Env: {
    id: number;
    name: string;
  }[];
}

export interface ListAvailableWsMcpsResponse {
  listAvailableWsMcps: AvailableWsMcpItem[];
}

// Query function for fetching available workspace MCPs
export const fetchAvailableWsMcps =
  async (): Promise<ListAvailableWsMcpsResponse> => {
    const response = await AxiosFetch.post<
      ApiResponse<ListAvailableWsMcpsResponse>
    >("", {
      query: ListAvailableWsMcpsQuery,
    });

    return response.data.data as ListAvailableWsMcpsResponse;
  };

// GraphQL query for listing current workspace MCPs
export const WorkspaceMcpQuery = `
query WorkspaceMcp {
    workspaceMcp {
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
            Tools {
                id
                name
                description
                examples
                createdAt
                updatedAt
            }
        }
        Tools {
            id
            name
            description
            examples
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
        Envs {
            id
            key
            value
        }
    }
}
`;

// Types for workspace MCP query response
export interface WorkspaceMcpItem {
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
    Tools: {
      id: number;
      name: string;
      description: string;
      examples: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };
  Tools: {
    id: number;
    name: string;
    description: string;
    examples: string;
    createdAt: string;
    updatedAt: string;
  }[];
  Workspace: {
    id: string;
    name: string;
    sys_instruction: string | null;
    createdAt: string;
    userRole: string;
  };
  Envs: {
    id: number;
    key: string;
    value: string;
  }[];
}

export interface WorkspaceMcpResponse {
  workspaceMcp: WorkspaceMcpItem[];
}

// Query function for fetching current workspace MCPs
export const fetchWorkspaceMcps = async (): Promise<WorkspaceMcpResponse> => {
  const response = await AxiosFetch.post<ApiResponse<WorkspaceMcpResponse>>(
    "",
    {
      query: WorkspaceMcpQuery,
    }
  );

  return response.data.data as WorkspaceMcpResponse;
};
