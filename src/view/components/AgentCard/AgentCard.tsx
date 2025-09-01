import { useState } from "react";
import style from "./AgentCard.module.css";
import Button from "../Button/Button";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../Input/Input";
import Image from "../Image/Image";

const AgentCard = ({
  agent,
  onUpdate,
  onDelete,
  addMode = false,
  editMode = false,
}: {
  agent: any;
  onUpdate?: () => void;
  onDelete?: () => void;
  addMode?: boolean;
  editMode?: boolean;
}) => {
  const [seeMore, setSeeMore] = useState(false);
  const [selected, setSelected] = useState(false);
  return (
    <div className={`${style.agentCard} glass-bg`}>
      <div className={style.agentCard_info}>
        <div className={style.actions}>
          {onDelete && (
            <Button theme="danger" onClick={onDelete}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>

        <div className={style.info}>
          <Image src={agent.image} alt={agent.name} />
          <h3>{agent.name}</h3>
        </div>

        <p className={style.description}>
          {agent.description.length > 100 ? (
            <>
              {" "}
              {agent.description.slice(
                0,
                seeMore ? agent.description.length : 100
              ) + (seeMore ? " " : "...")}
              <button type="button" onClick={() => setSeeMore((s) => !s)}>
                {seeMore ? "See Less" : "See More"}
              </button>
            </>
          ) : (
            agent.description
          )}
        </p>

        <div className={style.agentCard_tools}>
          {agent.tools.map((tool: any) => (
            <span key={tool.id} className="glass-bg">
              {tool.name}
            </span>
          ))}
        </div>

        {(addMode || editMode) && (
          <div className={style.addControls}>
            {selected && (
              <div className={style.formInputs}>
                <Input label="env1" placeholder="Env 1" />
                <Input label="env2" placeholder="Env 2" />
                <Input label="env3" placeholder="Env 3" />
              </div>
            )}
            <div className={style.actionBTNs}>
              {addMode && (
                <Button theme="primary" onClick={() => setSelected(true)}>
                  {selected ? "Save" : "Assign"}
                </Button>
              )}
              {editMode && (
                <Button
                  theme="primary"
                  onClick={selected ? onUpdate : () => setSelected(true)}
                >
                  {selected ? "Save" : "Edit"}
                </Button>
              )}
              {selected && (
                <Button theme="danger" onClick={() => setSelected(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCard;
