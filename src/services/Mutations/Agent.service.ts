import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// Create Agent Mutation
export const CreateAgentMutation = `
mutation CreateAgent($createAgentInput: CreateAgentInput!) {
    createAgent(createAgentInput: $createAgentInput) {
        id
        name
        sys_instruction
        icon
        status
        version
        createdAt
        updatedAt
        AgentTools {
            id
            name
            icon
            description
            version
            createdAt
            updatedAt
            Requirements {
                id
                key
            }
        }
    }
}
`;

// Types for create agent
export interface CreateAgentInput {
  name: string;
  icon: string;
  version: string;
  sys_instruction: string;
  AgentMcpIds: number[];
}

export interface CreateAgentVariables {
  createAgentInput: CreateAgentInput;
}

export interface AgentToolRequirement {
  id: number;
  key: string;
}

export interface CreatedAgentTool {
  id: number;
  name: string;
  icon: string;
  description: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  Requirements: AgentToolRequirement[];
}

export interface CreatedAgent {
  id: number;
  name: string;
  sys_instruction: string;
  icon: string;
  status: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  AgentTools: CreatedAgentTool[];
}

export interface CreateAgentResponse {
  createAgent: CreatedAgent;
}

// Mutation function
export const createAgentMutation = async (
  input: CreateAgentInput
): Promise<CreateAgentResponse> => {
  const response = await AxiosFetch.post<ApiResponse<CreateAgentResponse>>("", {
    query: CreateAgentMutation,
    variables: {
      createAgentInput: input,
    },
  });

  return response.data.data as CreateAgentResponse;
};

// Update Agent Mutation
export const UpdateAgentMutation = `
mutation UpdateAgent($id: Int!, $updateAgentInput: UpdateAgentInput!) {
    updateAgent(id: $id, updateAgentInput: $updateAgentInput) {
        id
        name
        sys_instruction
        icon
        status
        version
        createdAt
        updatedAt
        AgentTools {
            id
            name
            icon
            description
            version
            createdAt
            updatedAt
            Requirements {
                id
                key
            }
        }
    }
}
`;

// Types for update agent
export interface UpdateAgentInput {
  name?: string;
  icon?: string | null;
  version?: string | null;
  sys_instruction?: string | null;
  newAgentMcpIds?: number[] | null;
  deleteAgentTools?: number[] | null;
}

export interface UpdateAgentVariables {
  id: number;
  updateAgentInput: UpdateAgentInput;
}

export interface UpdateAgentResponse {
  updateAgent: CreatedAgent;
}

// Update mutation function
export const updateAgentMutation = async (
  id: number,
  input: UpdateAgentInput
): Promise<UpdateAgentResponse> => {
  const response = await AxiosFetch.post<ApiResponse<UpdateAgentResponse>>("", {
    query: UpdateAgentMutation,
    variables: {
      id,
      updateAgentInput: input,
    },
  });

  return response.data.data as UpdateAgentResponse;
};
