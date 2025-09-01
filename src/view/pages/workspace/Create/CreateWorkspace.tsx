import { useMemo, useState } from "react";
import "./CreateWorkspace.css";
import Input from "../../../components/Input/Input";
import Textarea from "../../../components/Textarea/Textarea";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal/Modal";

const CreateWorkspace = () => {
  const [showSelectAgent, setShowSelectAgent] = useState(false);
  const [SelectedAgent, setSelectedAgent] = useState<any[]>([]);
  const Agents = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => ({
      id: index,
      name: `Agent ${index + 1}`,
      tools: ["tool1", "tool2", "tool3"],
      icon: `https://placehold.co/60`,
      requirements: ["Requirement 1", "Requirement 2", "Requirement 3"],
    }));
  }, []);

  return (
    <section className="createWS section-page container">
      <h2>Create Workspace</h2>
      <form>
        <div className="headline">
          <h3>Workspace Information</h3>
        </div>
        <div className="info-box form-box">
          <label htmlFor="image" className="image_input">
            <img src="https://placehold.co/200" alt="workspace" />
            <input type="file" name="image" id="image" accept="image/*" />
          </label>

          <div className="column-input">
            <Input placeholder="Workspace Name" />
            <Textarea placeholder="General system instructions" />
          </div>
        </div>

        <div className="form-footer">
          <Button theme="primary">Create Workspace</Button>
        </div>
      </form>

      <Modal
        open={showSelectAgent}
        className="select-agent-modal"
        title="Select Agent"
        onClose={() => setShowSelectAgent(false)}
      >
        <div className="search-box">
          <Input placeholder="Search For Agent" />
        </div>
        <div className="agent-list">
          {Agents.length > 0 &&
            Agents.map((a) => (
              <button
                className={`agent-item ${
                  SelectedAgent.find((ag) => ag.id === a.id) ? "selected" : ""
                }`}
                onClick={() => {
                  const idx = SelectedAgent.findIndex((ag) => ag.id == a.id);
                  if (idx != -1) {
                    setSelectedAgent(SelectedAgent.filter((_, i) => i !== idx));
                  } else {
                    setSelectedAgent([...SelectedAgent, a]);
                  }
                }}
              >
                <img src={a.icon} alt={a.name} />
                <div className="info">
                  <p className="agent-name">{a.name}</p>
                  <div className="agent-tools">
                    {a.tools.length > 0 &&
                      a.tools.map((t) => (
                        <span className="agent-tool">{t}</span>
                      ))}
                  </div>
                </div>
              </button>
            ))}
        </div>
      </Modal>
    </section>
  );
};

export default CreateWorkspace;
