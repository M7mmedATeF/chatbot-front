import { useState } from "react";
import "./WorkspaceAgentsList.css";
import Input from "../../../components/Input/Input";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AgentCard from "../../../components/AgentCard/AgentCard";
import Modal from "../../../components/Modal/Modal";
import { useMCP } from "../../../../hooks/useMCP";
import type { MCPItem } from "../../../../services/Queries/MCPs.gql";

const WorkspaceAgentsList = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const { mcps, isLoadingList } = useMCP();

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
            mcps?.map((mcp: MCPItem) => (
              <AgentCard key={mcp.id} mcp={mcp} editMode onSave={() => {}} />
            ))
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
