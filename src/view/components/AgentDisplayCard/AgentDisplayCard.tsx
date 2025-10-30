import { useState, useRef, useEffect } from "react";
import style from "./AgentDisplayCard.module.css";
import Image from "../Image/Image";
import type { AgentItem } from "../../../services/Queries/Agents.gql";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import { useChangeAgentStatus } from "../../../hooks/useChangeAgentStatus";
import type { AgentStatus } from "../../../services/Mutations/Agent.gql";
import Button from "../Button/Button";
import Loader from "../Loader/Loader";

const MAX_INSTRUCTION_LENGTH = 150;

const AGENT_STATUSES: AgentStatus[] = ["ACTIVE", "MAINTENANCE", "INACTIVE"];

interface AgentDisplayCardProps {
  agent: AgentItem;
  onEdit?: (agent: AgentItem) => void;
}

const AgentDisplayCard = ({ agent, onEdit }: AgentDisplayCardProps) => {
  const [showFullInstruction, setShowFullInstruction] = useState(false);
  const [expandedMcpIds, setExpandedMcpIds] = useState<Set<number>>(new Set());
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: changeStatus, isPending: isChangingStatus } =
    useChangeAgentStatus();

  const toggleMcpExpanded = (mcpId: number) => {
    setExpandedMcpIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mcpId)) {
        newSet.delete(mcpId);
      } else {
        newSet.add(mcpId);
      }
      return newSet;
    });
  };

  const handleStatusChange = (newStatus: AgentStatus) => {
    if (newStatus === agent.status) {
      setShowStatusDropdown(false);
      return;
    }

    changeStatus(
      { id: agent.id, status: newStatus },
      {
        onSuccess: () => {
          setShowStatusDropdown(false);
        },
      }
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    };

    if (showStatusDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusDropdown]);

  const instructionText = agent.sys_instruction || "";
  const shouldTruncateInstruction =
    instructionText.length > MAX_INSTRUCTION_LENGTH;

  return (
    <div className={`${style.agentCard} glass-bg`}>
      <div className={style.agentCard_info}>
        <div className={style.header}>
          <div className={style.info}>
            <Image src={agent.icon} alt={agent.name} />
            <div>
              <h3 className="whitespace-nowrap text-ellipsis overflow-hidden">
                {agent.name}
              </h3>
              <span className={style.agentVersion}>v{agent.version}</span>
            </div>
          </div>
          <div className={style.headerActions}>
            <div className={style.statusContainer} ref={dropdownRef}>
              <button
                className={`${style.statusButton} ${
                  agent.status?.toLowerCase() === "active"
                    ? style.active
                    : agent.status?.toLowerCase() === "maintenance"
                    ? style.maintenance
                    : style.inactive
                }`}
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                disabled={isChangingStatus}
              >
                {agent.status || "Unknown"}
                <FaChevronDown size={10} />
              </button>
              {isChangingStatus && (
                <div className={style.statusLoader}>
                  <Loader />
                </div>
              )}
              {showStatusDropdown && !isChangingStatus && (
                <div className={style.statusDropdown}>
                  {AGENT_STATUSES.map((status) => (
                    <button
                      key={status}
                      className={`${style.statusOption} ${
                        status === agent.status ? style.selected : ""
                      } ${
                        status.toLowerCase() === "active"
                          ? style.active
                          : status.toLowerCase() === "maintenance"
                          ? style.maintenance
                          : style.inactive
                      }`}
                      onClick={() => handleStatusChange(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {onEdit && (
              <Button
                onClick={() => onEdit(agent)}
                className={style.editButton}
                style={{
                  padding: "0px",
                }}
              >
                <FaEdit size={14} />
              </Button>
            )}
          </div>
        </div>

        {instructionText && (
          <>
            <div className="separator"></div>
            <p className={style.instruction}>
              {shouldTruncateInstruction && !showFullInstruction
                ? `${instructionText.slice(0, MAX_INSTRUCTION_LENGTH)}...`
                : instructionText}
              {shouldTruncateInstruction && (
                <button
                  type="button"
                  onClick={() => setShowFullInstruction((prev) => !prev)}
                >
                  {showFullInstruction ? "Show Less" : "Show More"}
                </button>
              )}
            </p>
          </>
        )}

        {agent.AgentTools && agent.AgentTools.length > 0 && (
          <>
            <div className="separator"></div>
            <div className={style.toolsSection}>
              <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 500 }}>
                MCP Tools ({agent.AgentTools.length})
              </h4>
              {agent.AgentTools.map((mcpTool) => {
                const isExpanded = expandedMcpIds.has(mcpTool.id);
                return (
                  <div key={mcpTool.id} className={style.mcpTool}>
                    <div
                      className={style.mcpHeader}
                      onClick={() => toggleMcpExpanded(mcpTool.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleMcpExpanded(mcpTool.id);
                        }
                      }}
                    >
                      <Image src={mcpTool.icon} alt={mcpTool.name} />
                      <div className={style.mcpInfo}>
                        <h4>{mcpTool.name}</h4>
                        <span className={style.version}>
                          v{mcpTool.version}
                        </span>
                      </div>
                      <div className={style.caretIcon}>
                        {isExpanded ? (
                          <FaChevronUp size={14} />
                        ) : (
                          <FaChevronDown size={14} />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className={style.mcpDetails}>
                        {mcpTool.description && (
                          <p className={style.mcpDescription}>
                            {mcpTool.description}
                          </p>
                        )}

                        {mcpTool.Tools && mcpTool.Tools.length > 0 && (
                          <div className={style.mcpToolsContainer}>
                            <h5 className={style.sectionTitle}>
                              Tools ({mcpTool.Tools.length})
                            </h5>
                            <div className={style.mcpTools}>
                              {mcpTool.Tools.map((tool) => (
                                <span key={tool.id} className={style.toolBadge}>
                                  {tool.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {mcpTool.Requirements &&
                          mcpTool.Requirements.length > 0 && (
                            <div className={style.mcpRequirementsContainer}>
                              <h5 className={style.sectionTitle}>
                                Requirements ({mcpTool.Requirements.length})
                              </h5>
                              <div className={style.mcpRequirements}>
                                {mcpTool.Requirements.map((req) => (
                                  <span key={req.id} className={style.reqBadge}>
                                    {req.key}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AgentDisplayCard;
