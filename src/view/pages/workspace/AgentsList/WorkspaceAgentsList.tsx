import "./WorkspaceAgentsList.css";
import { useAvailableWsMcps } from "../../../../hooks/useWorkspaces";
import type { AvailableWsMcpItem } from "../../../../services/Queries/Workspaces.gql";
import McpAssignCard from "../../../components/McpAssignCard/McpAssignCard";
import Loader from "../../../components/Loader/Loader";
import Input from "../../../components/Input/Input";
import { useMemo, useState } from "react";
import { useDebounce } from "../../../../hooks/useDebounce";

const WorkspaceAgentsList = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const {
    data: mcpsData,
    isLoading: isLoadingList,
    refetch,
  } = useAvailableWsMcps();

  const viewAgents = useMemo(() => {
    return mcpsData?.listAvailableWsMcps?.filter((mcp) => {
      return mcp.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    });
  }, [mcpsData, debouncedSearch]);

  return (
    <section className="workspace-agents section-page sys_container">
      <div className="headline">
        <h2>Workspace Agents</h2>

        <div>
          <Input
            value={search}
            onChange={(e) => setSearch(e)}
            placeholder="Search agents..."
          />
        </div>
      </div>

      <div className="agents-list">
        {isLoadingList ? (
          <div className="loading">
            <Loader />
            Loading agents...
          </div>
        ) : viewAgents?.length || 0 > 0 ? (
          <>
            <div className="agents-list-column">
              {viewAgents
                ?.filter((_, idx: number) => idx % 2 === 0)
                .map((workspaceMcp: AvailableWsMcpItem) => (
                  <McpAssignCard key={workspaceMcp.id} mcp={workspaceMcp} />
                ))}
            </div>
            <div className="agents-list-column">
              {viewAgents
                ?.filter((_, idx: number) => idx % 2 === 1)
                .map((workspaceMcp: AvailableWsMcpItem) => (
                  <McpAssignCard
                    key={workspaceMcp.id}
                    mcp={workspaceMcp}
                    onUpdate={refetch}
                  />
                ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <p>No agents found matching "{debouncedSearch}"</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkspaceAgentsList;
