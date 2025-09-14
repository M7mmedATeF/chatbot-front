import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "./AssignWorkspaceAgent.css";
import Input from "../../../components/Input/Input";
import AgentCard from "../../../components/AgentCard/AgentCard";
import { useMCP } from "../../../../hooks/useMCP";
import type { MCPItem, MCPTool } from "../../../../services/Queries/MCPs.gql";
import { useDebounce } from "../../../../hooks/useDebounce";
import {
  createWorkspaceMcpMutation,
  type CreateWorkspaceMcpVariables,
  type EnvVariable,
} from "../../../../services/Mutations/Workspace.gql";

const AssignWorkspaceAgent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const value = useDebounce(searchTerm, 300);
  const { mcps, isLoadingList } = useMCP();
  const queryClient = useQueryClient();

  // Filter MCPs based on search term
  const filteredMcps = useMemo(() => {
    return mcps?.filter(
      (mcp: MCPItem) =>
        mcp.name.toLowerCase().includes(value.toLowerCase()) ||
        mcp.description.toLowerCase().includes(value.toLowerCase())
    );
  }, [mcps, value]);

  // Mutation for assigning MCP to workspace
  const assignMcpMutation = useMutation({
    mutationFn: createWorkspaceMcpMutation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workspaceMcps"] });
      toast.success(
        `${data.createWorkspaceMcp.Mcp.name} assigned successfully!`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while assigning the MCP");
    },
  });

  // Handle saving/assigning MCP
  const handleSave = (data: {
    mcp: MCPItem;
    selectedTools: MCPTool[];
    envVariables: EnvVariable[];
  }) => {
    const { mcp, selectedTools, envVariables } = data;

    const mutationData: CreateWorkspaceMcpVariables = {
      createWorkspaceMcpInput: {
        mcpId: mcp.id,
        toolsIds: selectedTools.map((tool) => tool.id),
        env: envVariables,
      },
    };

    assignMcpMutation.mutate(mutationData);
  };

  return (
    <section className="workspace-agents section-page sys_container">
      <h2>Assign Agent To Workspace</h2>

      <form>
        <div className="form-box">
          <Input
            placeholder="Search for agent"
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        <div className="agents-list">
          {isLoadingList ? (
            <div className="loading">Loading agents...</div>
          ) : (
            filteredMcps?.map((mcp: MCPItem) => (
              <AgentCard key={mcp.id} mcp={mcp} addMode onSave={handleSave} />
            ))
          )}
        </div>
      </form>
    </section>
  );
};

export default AssignWorkspaceAgent;
