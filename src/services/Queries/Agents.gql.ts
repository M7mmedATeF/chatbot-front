import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL query string
export const ListAgentsQuery = `
query Agents {
    agents {
        id
        name
        sys_instruction
        status
        version
        AgentTools {
            id
            name
            Requirements {
                id
                key
            }
            icon
            description
            version
            Tools {
                id
                name
                description
                createdAt
                updatedAt
            }
            createdAt
            updatedAt
        }
        icon
        createdAt
        updatedAt
    }
}
`;

// Types for the query response
export interface AgentToolRequirement {
  id: number;
  key: string;
}

export interface AgentTool {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentToolEnv {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentMCPTool {
  id: number;
  name: string;
  Requirements: AgentToolRequirement[];
  icon: string;
  description: string;
  version: string;
  Tools: AgentTool[];
  createdAt: string;
  updatedAt: string;
  Env: AgentToolEnv;
}

export interface AgentItem {
  id: number;
  name: string;
  sys_instruction: string;
  status: string;
  version: string;
  AgentTools: AgentMCPTool[];
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListAgentsResponse {
  agents: AgentItem[];
}

// Query function using AxiosFetch
export const listAgentsQuery = async (): Promise<ListAgentsResponse> => {
  const response = await AxiosFetch.post<ApiResponse<ListAgentsResponse>>("", {
    query: ListAgentsQuery,
  });

  return response.data.data as ListAgentsResponse;
};
