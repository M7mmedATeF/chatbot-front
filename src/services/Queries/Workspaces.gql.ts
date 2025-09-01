import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL query string
export const MyWorkspacesQuery = `
query MyWorkspaces {
    myWorkspaces {
        id
        name
        createdAt
    }
}
`;

// Types for the query response
export interface GraphQLWorkspace {
  id: string;
  name: string;
  createdAt: string;
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
