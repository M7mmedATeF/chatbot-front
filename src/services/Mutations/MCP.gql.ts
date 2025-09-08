// GraphQL mutation for creating MCP
export const CreateMCPMutation = `
mutation CreateMcp($createMcpInput: CreateMcpToolInput!) {
    createMcp(createMcpInput: $createMcpInput) {
        createdAt
        description
        icon
        id
        name
        path
        updatedAt
        version
    }
}
`;

// GraphQL mutation for updating MCP
export const UpdateMCPMutation = `
mutation UpdateMcp($id: Int!, $updateMcpInput: UpdateMcpToolInput!) {
    updateMcp(id: $id, updateMcpInput: $updateMcpInput) {
        createdAt
        description
        icon
        id
        name
        path
        updatedAt
        version
    }
}
`;

// GraphQL mutation for deleting MCP
export const RemoveMCPMutation = `
mutation RemoveMcp($id: Int!) {
    removeMcp(id: $id) {
        createdAt
        description
        icon
        id
        name
        path
        updatedAt
        version
        Requirements {
            id
            key
        }
    }
}
`;

export type ToolsInput = {
  name: string;
  description: string;
};

// Types for the mutation
export interface CreateMCPInput {
  description: string;
  icon: string;
  name: string;
  path: string;
  requirements: string[];
  tools: ToolsInput[];
  version: string;
}

export interface CreateMCPVariables {
  createMcpInput: CreateMCPInput;
}

export interface CreateMCPResponse {
  createMcp: {
    createdAt: string;
    description: string;
    icon: string;
    id: string;
    name: string;
    path: string;
    updatedAt: string;
    version: string;
  };
}

// Types for update mutation
export interface UpdateMCPInput {
  name?: string;
  path?: string;
  delete_requirements?: number[];
  new_requirements?: string[];
  version?: string | null;
  description?: string | null;
  icon?: string | null;
  new_tools?: ToolsInput[];
  delete_tools?: number[];
}

export interface UpdateMCPVariables {
  id: number;
  updateMcpInput: UpdateMCPInput;
}

export interface UpdateMCPResponse {
  updateMcp: {
    createdAt: string;
    description: string;
    icon: string;
    id: string;
    name: string;
    path: string;
    updatedAt: string;
    version: string;
  };
}

// Types for remove mutation
export interface RemoveMCPVariables {
  id: number;
}

export interface RemoveMCPResponse {
  removeMcp: {
    createdAt: string;
    description: string;
    icon: string;
    id: string;
    name: string;
    path: string;
    updatedAt: string;
    version: string;
    Requirements: {
      id: number;
      key: string;
    }[];
  };
}
