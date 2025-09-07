import { useState } from "react";
import "./AdminMCPsList.css";
import Input from "../../../components/Input/Input";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AgentCard from "../../../components/AgentCard/AgentCard";
import Modal from "../../../components/Modal/Modal";
import ImageInput from "../../../components/ImageInput/ImageInput";

const AdminMCPsList = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [searchTerm] = useState("");

  return (
    <section className="admin-agents section-page container">
      <div className="headline">
        <div>
          <h2>System MCPs</h2>
          <p>Manage all MCPs in the system</p>
        </div>

        <div className="actions">
          <Button theme="borderd">
            <FontAwesomeIcon icon={faSearch} />
            <span>Search</span>
          </Button>
          <Button theme="primary" onClick={() => setShowCreate(true)}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Create MCP</span>
          </Button>
        </div>
      </div>

      <div className="search-section">
        <Input
          placeholder="Search mcps..."
          value={searchTerm}
          // onChange={setSearchTerm}
        />
      </div>

      <div className="agents-stats">
        <div className="stat-card">
          <h3>Total MCPs</h3>
          <span className="stat-number">24</span>
        </div>
        <div className="stat-card">
          <h3>Active MCPs</h3>
          <span className="stat-number">18</span>
        </div>
        <div className="stat-card">
          <h3>Inactive MCPs</h3>
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
              name: `MCP ${index + 1}`,
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
              console.log("Update MCP", index + 1);
            }}
            onDelete={() => {
              console.log("Delete MCP", index + 1);
            }}
          />
        ))}
      </div>

      <Modal
        open={showCreate}
        title="Create New MCP"
        onClose={() => setShowCreate(false)}
        onSave={() => {
          setShowCreate(false);
          setName("");
          // يمكنك إضافة منطق الحفظ الفعلي لاحقًا هنا
        }}
      >
        <div className="create-agent-form">
          <div className="mcp-image-input">
            <ImageInput />

            <div className="info-box">
              <p>Upload a MCP image</p>
              <small>Accepts: .jpg, .png, .svg, .webp</small>
              <small>Max size: 1MB</small>
            </div>
          </div>
          <Input
            label="MCP Name"
            value={name}
            onChange={(e: any) => setName(e)}
            placeholder="eg: Notion, Shopify, etc."
          />
          <Input label="Description" placeholder="eg: Control notion account" />
          <Input label="Path" placeholder="eg: notion_MCP/notion_mcp.js" />
          <Input
            label="Requirements"
            placeholder="eg: NOTION_API_KEY,NOTION_VERSION"
          />
          <Input label="Tools" placeholder="[]" />
          <Input label="Version" placeholder="0.1.0" />
        </div>
      </Modal>
    </section>
  );
};

export default AdminMCPsList;
