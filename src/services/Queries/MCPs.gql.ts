import type { MCPType } from "../../view/pages/admin/mcps/AdminMCPsList";
import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL query string
export const ListMCPsQuery = `
query Mcps {
    mcps {
        id
        name
        Tools {
            id
            name
            description
            createdAt
            updatedAt
        }
        Requirements {
            id
            key
        }
        icon
        description
        version
        createdAt
        updatedAt
        type
        command
        Files {
            id
            file_name
            file_path
            is_main
            fileContent
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
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface MCPFile {
  id: number;
  file_name: string;
  file_path: string;
  is_main: boolean;
  fileContent: string;
}

export interface MCPItem {
  id: number;
  name: string;
  Tools: MCPTool[];
  Requirements: MCPRequirement[];
  icon: string;
  description: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  type: MCPType;
  command: string;
  Files: MCPFile[];
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
