import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL query string
export const ListAssignAgentsQuery = `
query ListAssignAgents {
    listAssignAgents {
        isAssigned
        agent {
            id
            name
            sys_instruction
            icon
            status
            version
            deletedAt
            createdAt
            updatedAt
            AgentTools {
                id
                icon
                name
                description
                type
                command
                version
                createdAt
                updatedAt
                Requirements {
                    id
                    key
                }
                Tools {
                    id
                    name
                    description
                    createdAt
                    updatedAt
                }
            }
        }
    }
}
`;

// Types for the query response
export interface ToolRequirement {
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

export interface AgentMCP {
  id: number;
  icon: string;
  name: string;
  description: string;
  type: string;
  command: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  Requirements: ToolRequirement[];
  Tools: AgentTool[];
}

export interface AssignableAgent {
  id: number;
  name: string;
  sys_instruction: string;
  icon: string;
  status: string;
  version: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  AgentTools: AgentMCP[];
}

export interface ListAssignAgentItem {
  isAssigned: boolean;
  agent: AssignableAgent;
}

export interface ListAssignAgentsResponse {
  listAssignAgents: ListAssignAgentItem[];
}

// Query function using AxiosFetch
export const listAssignAgentsQuery =
  async (): Promise<ListAssignAgentsResponse> => {
    const response = await AxiosFetch.post<
      ApiResponse<ListAssignAgentsResponse>
    >("", {
      query: ListAssignAgentsQuery,
    });

    return response.data.data as ListAssignAgentsResponse;
  };
