import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// Assign Agent To Workspace Mutation
export const AssignAgentToWorkspaceMutation = `
mutation AssignAgentToWorkspace($assignWorkspaceAgentInput: AssignWorkspaceAgentInput!) {
    assignAgentToWorkspace(assignWorkspaceAgentInput: $assignWorkspaceAgentInput) {
        id
        sys_instruction
        createdAt
        updatedAt
        env {
            id
            key
            value
        }
    }
}
`;

// Types for assign agent
export interface EnvVariable {
  key: string;
  value: string;
}

export interface AssignWorkspaceAgentInput {
  agentId: number;
  sys_instructions: string;
  toolIds: number[];
  env: EnvVariable[];
}

export interface AssignWorkspaceAgentVariables {
  assignWorkspaceAgentInput: AssignWorkspaceAgentInput;
}

export interface EnvResponse {
  id: number;
  key: string;
  value: string;
}

export interface AssignedWorkspaceAgent {
  id: number;
  sys_instruction: string;
  createdAt: string;
  updatedAt: string;
  env: EnvResponse[];
}

export interface AssignAgentToWorkspaceResponse {
  assignAgentToWorkspace: AssignedWorkspaceAgent;
}

// Mutation function
export const assignAgentToWorkspaceMutation = async (
  input: AssignWorkspaceAgentInput
): Promise<AssignAgentToWorkspaceResponse> => {
  const response = await AxiosFetch.post<
    ApiResponse<AssignAgentToWorkspaceResponse>
  >("", {
    query: AssignAgentToWorkspaceMutation,
    variables: {
      assignWorkspaceAgentInput: input,
    },
  });

  return response.data.data as AssignAgentToWorkspaceResponse;
};

// Remove Agent From Workspace Mutation
export const RemoveWorkspaceAgentMutation = `
mutation RemoveWorkspaceAgent($removeWorkspaceAgentInput: RemoveWorkspaceAgentInput!) {
    removeWorkspaceAgent(removeWorkspaceAgentInput: $removeWorkspaceAgentInput) {
        createdAt
        id
        name
    }
}
`;

// Types for remove agent
export interface RemoveWorkspaceAgentInput {
  workspaceAgentId: number;
}

export interface RemoveWorkspaceAgentVariables {
  removeWorkspaceAgentInput: RemoveWorkspaceAgentInput;
}

export interface RemovedWorkspaceAgent {
  createdAt: string;
  id: number;
  name: string;
}

export interface RemoveWorkspaceAgentResponse {
  removeWorkspaceAgent: RemovedWorkspaceAgent;
}

// Mutation function
export const removeWorkspaceAgentMutation = async (
  input: RemoveWorkspaceAgentInput
): Promise<RemoveWorkspaceAgentResponse> => {
  const response = await AxiosFetch.post<
    ApiResponse<RemoveWorkspaceAgentResponse>
  >("", {
    query: RemoveWorkspaceAgentMutation,
    variables: {
      removeWorkspaceAgentInput: input,
    },
  });

  return response.data.data as RemoveWorkspaceAgentResponse;
};