import "./WorkspaceAgentsList.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAvailableWsMcps } from "../../../../hooks/useWorkspaces";
import type { AvailableWsMcpItem } from "../../../../services/Queries/Workspaces.gql";
import McpAssignCard from "../../../components/McpAssignCard/McpAssignCard";

const WorkspaceAgentsList = () => {
  const {
    data: mcpsData,
    isLoading: isLoadingList,
    refetch,
  } = useAvailableWsMcps();

  return (
    <section className="workspace-agents section-page sys_container">
      <div className="headline">
        <h2>Workspace Agents</h2>

        <Button href="assign" theme="borderd">
          <FontAwesomeIcon icon={faPlus} />
          <span>Assign Agent</span>
        </Button>
      </div>

      <div className="agents-list">
        {isLoadingList ? (
          <div className="loading">Loading agents...</div>
        ) : (
          <>
            <div className="agents-list-column">
              {mcpsData?.listAvailableWsMcps
                ?.filter((_, idx: number) => idx % 2 === 0)
                .map((workspaceMcp: AvailableWsMcpItem) => (
                  <McpAssignCard key={workspaceMcp.id} mcp={workspaceMcp} />
                ))}
            </div>
            <div className="agents-list-column">
              {mcpsData?.listAvailableWsMcps
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
        )}
      </div>
    </section>
  );
};

export default WorkspaceAgentsList;
