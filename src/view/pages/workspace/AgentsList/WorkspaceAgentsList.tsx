import { useState } from "react";
import "./WorkspaceAgentsList.css";
import Input from "../../../components/Input/Input";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../../components/Modal/Modal";
import { useAvailableWsMcps } from "../../../../hooks/useWorkspaces";
import type { AvailableWsMcpItem } from "../../../../services/Queries/Workspaces.gql";
import McpAssignCard from "../../../components/McpAssignCard/McpAssignCard";

const WorkspaceAgentsList = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const { data: mcpsData, isLoading: isLoadingList } = useAvailableWsMcps();

  return (
    <section className="workspace-agents section-page sys_container">
      <div className="headline">
        <h2>Workspace Agents</h2>

        <Button href="assign" theme="borderd">
          <FontAwesomeIcon icon={faPlus} />
          <span>Assign Agent</span>
        </Button>
      </div>

      <form>
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
                    <McpAssignCard key={workspaceMcp.id} mcp={workspaceMcp} />
                  ))}
              </div>
            </>
          )}
        </div>
      </form>

      <Modal
        open={showCreate}
        title="Create Agent"
        onClose={() => setShowCreate(false)}
        onSave={() => {
          setShowCreate(false);
        }}
      >
        <Input
          value={name}
          onChange={(e: any) => setName(e)}
          placeholder="Agent Name"
        />
      </Modal>
    </section>
  );
};

export default WorkspaceAgentsList;
