import { useState } from "react";
import Input from "../../../components/Input/Input";
// import AgentCard from "../../../components/AgentCard/AgentCard";
import Modal from "../../../components/Modal/Modal";

const AssignTeamAgent = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  return (
    <section className="workspace-agents section-page sys_container">
      <h2>Assign Agent To Team</h2>

      <form>
        <div className="form-box">
          <Input placeholder="Search for agent" />
        </div>

        <div className="agents-list">
          {/* {Array.from({ length: 9 }).map((_, index) => (
            <AgentCard
              addMode
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

export default AssignTeamAgent;
