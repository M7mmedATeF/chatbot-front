import type { MCPRequirement, MCPTool } from "../services/Queries/MCPs.gql";

export type EditTypes = "ENVIRONMENTS" | "CONTROLS";

export type MCP = {
  id: number;
  name: string;
  icon: string;
  description: string;
  tools?: MCPTool[];
  requirements?: MCPRequirement[];
};
