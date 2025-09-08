import { useState } from "react";
import style from "./AgentCard.module.css";
import Button from "../Button/Button";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../Input/Input";
import Image from "../Image/Image";
import type { EditTypes } from "../../../types/mcp.entity";
import type {
  MCPItem,
  MCPRequirement,
  MCPTool,
} from "../../../services/Queries/MCPs.gql";

const MAX_VIEW_ITEMS = 2;

const AgentCard = ({
  mcp,
  onUpdate,
  onDelete,
  onCancel,
  addMode = false,
  editMode = false,
  editType = "ENVIRONMENTS",
}: {
  mcp: MCPItem;
  onUpdate?: (mcp: MCPItem) => void;
  onDelete?: (mcp: MCPItem) => void;
  onCancel?: (mcp: MCPItem) => void;
  addMode?: boolean;
  editMode?: boolean;
  editType?: EditTypes;
}) => {
  const [seeMoreDescription, setSeeMoreDescription] = useState(false);
  const [seeMoreTools, setSeeMoreTools] = useState(false);
  const [seeMoreRequirements, setSeeMoreRequirements] = useState(false);
  const [selected, setSelected] = useState(false);
  return (
    <div className={`${style.agentCard} glass-bg`}>
      <div className={style.agentCard_info}>
        <div className="flex justify-between items-center gap-4">
          <div className={style.info}>
            <Image src={mcp.icon} alt={mcp.name} />
            <h3 className="whitespace-nowrap text-ellipsis overflow-hidden text-sm font-normal">
              {mcp.name}
            </h3>
          </div>

          <div className={style.actions}>
            {editMode && editType == "CONTROLS" && onUpdate && (
              <Button theme="primary" onClick={() => onUpdate(mcp)}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            )}
            {onDelete && (
              <Button theme="danger" onClick={() => onDelete(mcp)}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            )}
          </div>
        </div>

        <p className={style.description}>
          {mcp.description.length > 100 ? (
            <>
              {" "}
              {mcp.description.slice(
                0,
                seeMoreDescription ? mcp.description.length : 100
              ) + (seeMoreDescription ? " " : "...")}
              <button
                type="button"
                onClick={() => setSeeMoreDescription((s) => !s)}
              >
                {seeMoreDescription ? "See Less" : "See More"}
              </button>
            </>
          ) : (
            mcp.description
          )}
        </p>

        {mcp.Tools && mcp.Tools.length > 0 && (
          <>
            <div className="separator"></div>

            <div className={style.agentCard_tools}>
              {mcp.Tools.slice(
                0,
                seeMoreTools ? mcp.Tools.length : MAX_VIEW_ITEMS
              ).map((tool: MCPTool) => (
                <span key={tool.id} className="glass-bg">
                  {tool.name}
                </span>
              ))}
              {mcp.Tools.length > MAX_VIEW_ITEMS && (
                <Button
                  theme="secondary"
                  className="glass-bg"
                  type="button"
                  onClick={() => setSeeMoreTools((s) => !s)}
                >
                  {seeMoreTools ? "See Less" : "See More"}
                </Button>
              )}
            </div>
          </>
        )}

        {mcp.Requirements && mcp.Requirements.length > 0 && (
          <>
            <div className="separator"></div>

            <div className={style.agentCard_tools}>
              {mcp.Requirements.slice(
                0,
                seeMoreRequirements ? mcp.Requirements.length : MAX_VIEW_ITEMS
              ).map((requirement: MCPRequirement) => (
                <span key={requirement.id} className="glass-bg">
                  {requirement.key}
                </span>
              ))}
              {mcp.Tools.length > MAX_VIEW_ITEMS && (
                <Button
                  theme="secondary"
                  type="button"
                  onClick={() => setSeeMoreRequirements((s) => !s)}
                >
                  {seeMoreRequirements ? "See Less" : "See More"}
                </Button>
              )}
            </div>
          </>
        )}

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
              {editMode && editType == "ENVIRONMENTS" && onUpdate && (
                <Button theme="primary" onClick={() => onUpdate(mcp)}>
                  {selected ? "Save" : "Edit"}
                </Button>
              )}
              {selected && onCancel && (
                <Button theme="danger" onClick={() => onCancel(mcp)}>
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
