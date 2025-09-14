import { useMemo, useState } from "react";
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
import { AiOutlineArrowLeft, AiOutlineClose } from "react-icons/ai";
import type { EnvVariable } from "../../../services/Mutations/Workspace.gql";

const MAX_VIEW_ITEMS = 2;

const AgentCard = ({
  mcp,
  onSave,
  onUpdate,
  onDelete,
  onCancel,
  addMode = false,
  editMode = false,
  editType = "ENVIRONMENTS",
}: {
  mcp: MCPItem;
  onSave?: (data: {
    mcp: MCPItem;
    selectedTools: MCPTool[];
    envVariables: EnvVariable[];
  }) => void;
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
  const [opened, setOpened] = useState(false);

  const [removedTools, setRemovedTools] = useState<MCPTool[]>([]);
  const [envVariables, setEnvVariables] = useState<Record<string, string>>({});

  const ViewTools = useMemo(() => {
    return mcp.Tools.filter((t) => !removedTools.includes(t));
  }, [mcp.Tools, removedTools]);

  const handleEnvChange = (key: string, value: string) => {
    setEnvVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      const selectedTools = ViewTools;
      const envVars: EnvVariable[] =
        mcp.Requirements?.map((req) => ({
          key: req.key,
          value: envVariables[req.key] || "",
        })) || [];

      onSave({
        mcp,
        selectedTools,
        envVariables: envVars,
      });
    }
    setOpened(false);
  };

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

        {!opened && mcp.Tools && mcp.Tools.length > 0 && (
          <>
            <div className="separator"></div>

            <div className={style.agentCard_tools}>
              {mcp.Tools.slice(
                0,
                seeMoreTools ? mcp.Tools.length : MAX_VIEW_ITEMS
              ).map((tool: MCPTool) => (
                <div key={tool.id} className="glass-bg">
                  {opened && (
                    <Button
                      theme="danger"
                      type="button"
                      onClick={() =>
                        setRemovedTools((s) =>
                          s.filter((t) => t.id !== tool.id)
                        )
                      }
                    >
                      <AiOutlineClose size={8} />
                    </Button>
                  )}
                  {tool.name}
                </div>
              ))}
              {!opened && mcp.Tools.length > MAX_VIEW_ITEMS && (
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

        {opened && ViewTools && ViewTools.length > 0 && (
          <>
            <div className="separator"></div>

            <div className={style.agentCard_tools}>
              {ViewTools.map((tool: MCPTool) => (
                <div key={tool.id} className="glass-bg">
                  <Button
                    className="tooltip"
                    data-tooltip="Remove Tool"
                    theme="success"
                    type="button"
                    onClick={() => setRemovedTools((s) => [...s, tool])}
                  >
                    <AiOutlineClose size={11} />
                  </Button>
                  {tool.name}
                </div>
              ))}
            </div>
          </>
        )}

        {removedTools && removedTools.length > 0 && (
          <>
            <div className="separator"></div>

            <div className={style.agentCard_tools}>
              {removedTools.map((tool: MCPTool) => (
                <div key={tool.id} className="glass-bg">
                  {opened && (
                    <Button
                      className="tooltip"
                      data-tooltip="Restore Tool"
                      theme="danger"
                      type="button"
                      onClick={() =>
                        setRemovedTools((s) =>
                          s.filter((t) => t.id !== tool.id)
                        )
                      }
                    >
                      <AiOutlineArrowLeft size={11} />
                    </Button>
                  )}
                  {tool.name}
                </div>
              ))}
            </div>
          </>
        )}

        {!opened && mcp.Requirements && mcp.Requirements.length > 0 && (
          <>
            <div className="separator"></div>

            <div className={style.agentCard_tools}>
              {mcp.Requirements.slice(
                0,
                opened || seeMoreRequirements
                  ? mcp.Requirements.length
                  : MAX_VIEW_ITEMS
              ).map((requirement: MCPRequirement) => (
                <div key={requirement.id} className="glass-bg">
                  {requirement.key}
                </div>
              ))}
              {!opened && mcp.Tools.length > MAX_VIEW_ITEMS && (
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
            {opened && mcp.Requirements && mcp.Requirements.length > 0 && (
              <>
                <div className="separator"></div>

                <div className={style.formInputs}>
                  {mcp.Requirements.map((req) => (
                    <Input
                      key={req.key}
                      label={req.key}
                      placeholder={`Add ${req.key}`}
                      value={envVariables[req.key] || ""}
                      onChange={(value) => handleEnvChange(req.key, value)}
                    />
                  ))}
                </div>
              </>
            )}
            <div className={style.actionBTNs}>
              {addMode && (
                <Button
                  theme="primary"
                  onClick={opened ? handleSave : () => setOpened(true)}
                >
                  {opened ? "Save" : "Assign"}
                </Button>
              )}
              {editMode && editType == "ENVIRONMENTS" && onUpdate && (
                <Button theme="primary" onClick={() => onUpdate(mcp)}>
                  {opened ? "Save" : "Edit"}
                </Button>
              )}
              {(opened || onCancel) && (
                <Button
                  theme="danger"
                  onClick={() =>
                    opened && !onCancel ? setOpened(false) : onCancel?.(mcp)
                  }
                >
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
