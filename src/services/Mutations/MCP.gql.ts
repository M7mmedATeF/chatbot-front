// GraphQL mutation for creating MCP
export const CreateMCPMutation = `
mutation CreateMcp($createMcpInput: CreateMcpToolInput!) {
    createMcp(createMcpInput: $createMcpInput) {
        id
        icon
        name
        description
        type
        command
        version
        createdAt
        updatedAt
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

export type FilesInput = {
  name: string;
  code: string;
  is_main: boolean;
};

// Types for the mutation
export interface CreateMCPInput {
  name: string;
  icon: string;
  description: string;
  type: string;
  command: string;
  version: string;
  Requirements: string[];
  tools: ToolsInput[];
  files: FilesInput[];
}

export interface CreateMCPVariables {
  createMcpInput: CreateMCPInput;
}

export interface CreateMCPResponse {
  createMcp: {
    id: string;
    icon: string;
    name: string;
    description: string;
    type: string;
    command: string;
    version: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Types for update mutation
export interface UpdateMCPInput {
  name?: string;
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
// GraphQL mutation for listing MCPs for workspace assignment
export const ListMCPsForWorkspaceMutation = `
mutation ListMcpsForWorkspace {
    listMcpsForWorkspace {
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
    }
}
`;

// Types for list MCPs for workspace mutation
export interface ListMCPsForWorkspaceResponse {
  listMcpsForWorkspace: {
    id: number;
    name: string;
    Tools: {
      id: number;
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    }[];
    Requirements: {
      id: number;
      key: string;
    }[];
    icon: string;
    description: string;
    version: string;
    createdAt: string;
    updatedAt: string;
  }[];
}
