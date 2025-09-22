import type { MCPType } from "../../view/pages/admin/mcps/AdminMCPsList";
import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL query string
export const ListMCPsQuery = `
query Mcps {
    mcps {
        createdAt
        description
        icon
        id
        name
        path
        updatedAt
        version
        type
        command
        Tools {
            createdAt
            description
            examples
            id
            name
            updatedAt
        }
        Requirements {
            id
            key
        }
    }
}
`;

// Types for the query response
export interface MCPRequirement {
  id: number;
  key: string;
}

export interface MCPTool {
  createdAt?: string;
  description?: string;
  examples?: string;
  id: number;
  name: string;
  updatedAt?: string;
}

export interface MCPItem {
  createdAt: string;
  description: string;
  icon: string;
  id: number;
  name: string;
  path: string;
  updatedAt: string;
  version: string;
  type: MCPType;
  command: string;
  Tools: MCPTool[];
  Requirements: MCPRequirement[];
}

export interface ListMCPsResponse {
  mcps: MCPItem[];
}

// Query function using AxiosFetch
export const listMCPsQuery = async (): Promise<ListMCPsResponse> => {
  const response = await AxiosFetch.post<ApiResponse<ListMCPsResponse>>("", {
    query: ListMCPsQuery,
  });

  return response.data.data as ListMCPsResponse;
};
