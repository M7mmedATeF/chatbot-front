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
