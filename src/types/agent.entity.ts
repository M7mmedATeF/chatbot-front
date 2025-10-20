import type { AgentItem, AgentMCPTool } from "../services/Queries/Agents.gql";

export type Agent = {
  id: number;
  name: string;
  sys_instruction: string;
  status: string;
  version: string;
  icon: string;
  AgentTools: AgentMCPTool[];
  createdAt: string;
  updatedAt: string;
};

export type { AgentItem, AgentMCPTool };
