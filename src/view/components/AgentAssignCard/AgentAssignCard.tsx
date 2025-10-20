import { useState, useEffect } from "react";
import style from "./AgentAssignCard.module.css";
import Image from "../Image/Image";
import Button from "../Button/Button";
import Toggle from "../Toggle/Toggle";
import Checkbox from "../Checkbox/Checkbox";
import Input from "../Input/Input";
import Loader from "../Loader/Loader";
import Textarea from "../Textarea/Textarea";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import type { ListAssignAgentItem } from "../../../services/Queries/WorkspaceAgents.gql";
import { useAssignAgentToWorkspace } from "../../../hooks/useAssignAgentToWorkspace";

interface AgentAssignCardProps {
  agentData: ListAssignAgentItem;
  onUpdate?: () => void;
}

const AgentAssignCard = ({ agentData, onUpdate }: AgentAssignCardProps) => {
  const { agent, isAssigned } = agentData;
  const [showAssign, setShowAssign] = useState(false);
  const [expandedMcpIds, setExpandedMcpIds] = useState<Set<number>>(new Set());
  const [showFullDefaultInstructions, setShowFullDefaultInstructions] =
    useState(false);
  const [sysInstructions, setSysInstructions] = useState("");
  const [selectedTools, setSelectedTools] = useState<Set<number>>(new Set());
  const [envValues, setEnvValues] = useState<Record<string, string>>({});

  const MAX_DEFAULT_INSTRUCTIONS_LENGTH = 200;

  const { mutate: assignAgent, isPending: isAssigning } =
    useAssignAgentToWorkspace();

  useEffect(() => {
    setShowAssign(isAssigned);
  }, [isAssigned]);

  const toggleMcp = (mcpId: number) => {
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

  const toggleTool = (toolId: number) => {
    setSelectedTools((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  };

  const handleEnvChange = (key: string, value: string) => {
    setEnvValues((prev) => ({ ...prev, [key]: value }));
  };

  // Collect all required env keys from selected tools
  const getRequiredEnvKeys = (): Set<string> => {
    const envKeys = new Set<string>();
    agent.AgentTools.forEach((mcp) => {
      const hasSelectedTools = mcp.Tools.some((tool) =>
        selectedTools.has(tool.id)
      );
      if (hasSelectedTools) {
        mcp.Requirements.forEach((req) => envKeys.add(req.key));
      }
    });
    return envKeys;
  };

  const requiredEnvKeys = Array.from(getRequiredEnvKeys());

  const handleAssign = () => {
    if (selectedTools.size === 0) {
      toast.error("Please select at least one tool");
      return;
    }

    // Validate all required env vars are filled
    for (const key of requiredEnvKeys) {
      if (!envValues[key]?.trim()) {
        toast.error(`${key} is required`);
        return;
      }
    }

    const env = requiredEnvKeys.map((key) => ({
      key,
      value: envValues[key],
    }));

    assignAgent(
      {
        agentId: agent.id,
        sys_instructions: sysInstructions.trim() || "",
        toolIds: Array.from(selectedTools),
        env,
      },
      {
        onSuccess: () => {
          toast.success("Agent assigned successfully");
          setShowAssign(false);
          if (onUpdate) onUpdate();
        },
        onError: (error) => {
          console.error("Failed to assign agent:", error);
          toast.error("Failed to assign agent. Please try again.");
        },
      }
    );
  };

  return (
    <div className={`${style.agentAssignCard} glass-bg`}>
      <div className={style.cardHeader}>
        <div className={style.agentInfo}>
          <Image src={agent.icon} alt={agent.name} />
          <div>
            <h3>{agent.name}</h3>
            <div className={style.agentMeta}>
              <span className={style.version}>v{agent.version}</span>
              <span
                className={`${style.status} ${
                  style[agent.status?.toLowerCase()]
                }`}
              >
                {agent.status}
              </span>
            </div>
          </div>
        </div>
        <Toggle
          theme={isAssigned ? "success" : "tertiary"}
          checked={showAssign}
          onChange={(checked: any) => setShowAssign(checked)}
        />
      </div>

      {showAssign && (
        <div className={style.assignContent}>
          <div className={style.section}>
            <label className={style.sectionLabel}>System Instructions</label>
            <div className={style.defaultInstructions}>
              <div className={style.defaultLabel}>
                <span>Default Instructions (from agent):</span>
              </div>
              <p className={style.defaultText}>
                {agent.sys_instruction.length >
                  MAX_DEFAULT_INSTRUCTIONS_LENGTH &&
                !showFullDefaultInstructions
                  ? `${agent.sys_instruction.slice(
                      0,
                      MAX_DEFAULT_INSTRUCTIONS_LENGTH
                    )}...`
                  : agent.sys_instruction}
                {agent.sys_instruction.length >
                  MAX_DEFAULT_INSTRUCTIONS_LENGTH && (
                  <button
                    type="button"
                    className={style.readMoreBtn}
                    onClick={() =>
                      setShowFullDefaultInstructions((prev) => !prev)
                    }
                  >
                    {showFullDefaultInstructions ? "Read Less" : "Read More"}
                  </button>
                )}
              </p>
            </div>
            <label className={style.sectionLabel}>
              Additional Instructions
            </label>
            <p className={style.helpText}>
              Optional: Add extra instructions that will be appended to the
              default system instructions.
            </p>
            <Textarea
              value={sysInstructions}
              onChange={setSysInstructions as any}
              placeholder="Enter additional instructions (optional)..."
              rows={4}
            />
          </div>

          <div className={style.section}>
            <label className={style.sectionLabel}>
              Select Tools ({agent.AgentTools.length} MCPs)
            </label>
            {agent.AgentTools.map((mcp) => {
              const isExpanded = expandedMcpIds.has(mcp.id);
              const mcpSelectedTools = mcp.Tools.filter((tool) =>
                selectedTools.has(tool.id)
              ).length;

              return (
                <div key={mcp.id} className={style.mcpCard}>
                  <div
                    className={style.mcpHeader}
                    onClick={() => toggleMcp(mcp.id)}
                  >
                    <Image src={mcp.icon} alt={mcp.name} />
                    <div className={style.mcpInfo}>
                      <h4>{mcp.name}</h4>
                      <span>
                        v{mcp.version} • {mcpSelectedTools}/{mcp.Tools.length}{" "}
                        tools
                      </span>
                    </div>
                    <div className={style.chevron}>
                      {isExpanded ? (
                        <FaChevronUp size={12} />
                      ) : (
                        <FaChevronDown size={12} />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={style.mcpTools}>
                      {mcp.Tools.map((tool) => (
                        <div key={tool.id} className={style.toolItem}>
                          <Checkbox
                            theme="primary"
                            checked={selectedTools.has(tool.id)}
                            onChange={() => toggleTool(tool.id)}
                          >
                            {tool.name}
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {requiredEnvKeys.length > 0 && (
            <div className={style.section}>
              <label className={style.sectionLabel}>
                Environment Variables ({requiredEnvKeys.length})
              </label>
              <div className={style.envGrid}>
                {requiredEnvKeys.map((key) => (
                  <Input
                    key={key}
                    label={key}
                    value={envValues[key] || ""}
                    onChange={(value) => handleEnvChange(key, value)}
                    placeholder={`Enter ${key}`}
                  />
                ))}
              </div>
            </div>
          )}

          <Button
            theme="primary"
            onClick={handleAssign}
            disabled={isAssigning}
            className={style.assignBtn}
          >
            {isAssigning ? <Loader /> : "Assign Agent"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AgentAssignCard;
