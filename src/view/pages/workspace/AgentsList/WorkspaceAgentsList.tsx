import { useState } from "react";
import "./WorkspaceAgentsList.css";
import Input from "../../../components/Input/Input";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import AgentCard from "../../../components/AgentCard/AgentCard";
import Modal from "../../../components/Modal/Modal";

const WorkspaceAgentsList = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
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
          {/* {Array.from({ length: 9 }).map((_, index) => (
            <AgentCard
              editMode
              mcp={{
                image: "https:/placehold.co/600x400",
                name: `Agent ${index + 1}`,
                description:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio accusantium deleniti ex enim, beatae blanditiis sapiente ea modi quidem tempore cumque obcaecati veniam suscipit assumenda itaque quaerat expedita consectetur? Esse?",
                tools: [
                  { id: 1, name: "Tool 1" },
                  { id: 2, name: "Tool 2" },
                  { id: 3, name: "Tool 3" },
                ],
              }}
            />
          ))} */}
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
