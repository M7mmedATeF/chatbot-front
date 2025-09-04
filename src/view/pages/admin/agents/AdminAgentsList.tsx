import { useState } from "react";
import "./AdminAgentsList.css";
import Input from "../../../components/Input/Input";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AgentCard from "../../../components/AgentCard/AgentCard";
import Modal from "../../../components/Modal/Modal";

const AdminAgentsList = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [searchTerm] = useState("");

  return (
    <section className="admin-agents section-page container">
      <div className="headline">
        <div>
          <h2>Admin Agents</h2>
          <p>Manage all agents in the system</p>
        </div>

        <div className="actions">
          <Button theme="borderd">
            <FontAwesomeIcon icon={faSearch} />
            <span>Search</span>
          </Button>
          <Button theme="primary" onClick={() => setShowCreate(true)}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Create Agent</span>
          </Button>
        </div>
      </div>

      <div className="search-section">
        <Input
          placeholder="Search agents..."
          value={searchTerm}
          // onChange={setSearchTerm}
        />
      </div>

      <div className="agents-stats">
        <div className="stat-card">
          <h3>Total Agents</h3>
          <span className="stat-number">24</span>
        </div>
        <div className="stat-card">
          <h3>Active Agents</h3>
          <span className="stat-number">18</span>
        </div>
        <div className="stat-card">
          <h3>Inactive Agents</h3>
          <span className="stat-number">6</span>
        </div>
      </div>

      <div className="agents-list">
        {Array.from({ length: 12 }).map((_, index) => (
          <AgentCard
            key={index}
            editMode
            agent={{
              image: "https://placehold.co/600x400",
              name: `Agent ${index + 1}`,
              description:
                "This is a powerful AI agent designed to handle various tasks and provide intelligent responses. It can process complex queries, analyze data, and generate insights to help users accomplish their goals efficiently.",
              tools: [
                { id: 1, name: "Data Analysis" },
                { id: 2, name: "Text Processing" },
                { id: 3, name: "API Integration" },
                { id: 4, name: "Code Generation" },
              ],
            }}
            onUpdate={() => {
              console.log("Update agent", index + 1);
            }}
            onDelete={() => {
              console.log("Delete agent", index + 1);
            }}
          />
        ))}
      </div>

      <Modal
        open={showCreate}
        title="Create New Agent"
        onClose={() => setShowCreate(false)}
        onSave={() => {
          setShowCreate(false);
          setName("");
        }}
      >
        <div className="create-agent-form">
          <Input
            label="Agent Name"
            value={name}
            onChange={(e: any) => setName(e)}
            placeholder="Enter agent name"
          />
          <Input label="Description" placeholder="Enter agent description" />
          <Input label="Model" placeholder="Select AI model" />
        </div>
      </Modal>
    </section>
  );
};

export default AdminAgentsList;
