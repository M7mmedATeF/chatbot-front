import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL mutation string
export const ChangeAgentStatusMutation = `
mutation ChangeAgentStatus($changeAgentStatusInput: ChangeAgentStatusInput!) {
    changeAgentStatus(changeAgentStatusInput: $changeAgentStatusInput) {
        id
        name
        sys_instruction
        icon
        status
        version
        deletedAt
        createdAt
        updatedAt
    }
}
`;

// Types for the mutation
export type AgentStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

export interface ChangeAgentStatusInput {
  id: number;
  status: AgentStatus;
}

export interface ChangeAgentStatusVariables {
  changeAgentStatusInput: ChangeAgentStatusInput;
}

export interface AgentStatusResponse {
  id: number;
  name: string;
  sys_instruction: string;
  icon: string;
  status: string;
  version: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeAgentStatusResponse {
  changeAgentStatus: AgentStatusResponse;
}

// Mutation function using AxiosFetch
export const changeAgentStatusMutation = async (
  input: ChangeAgentStatusInput
): Promise<ChangeAgentStatusResponse> => {
  const response = await AxiosFetch.post<
    ApiResponse<ChangeAgentStatusResponse>
  >("", {
    query: ChangeAgentStatusMutation,
    variables: {
      changeAgentStatusInput: input,
    },
  });

  return response.data.data as ChangeAgentStatusResponse;
};
