import style from "./McpSelectCard.module.css";
import type { MCPItem } from "../../../services/Queries/MCPs.gql";
import Image from "../Image/Image";
import { FaCheck } from "react-icons/fa";

interface McpSelectCardProps {
  mcp: MCPItem;
  selected: boolean;
  onToggle: () => void;
}

const McpSelectCard = ({ mcp, selected, onToggle }: McpSelectCardProps) => {
  return (
    <div
      className={`${style.mcpSelectCard} ${
        selected ? style.selected : ""
      } glass-bg`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {selected && (
        <div className={style.checkmark}>
          <FaCheck size={12} />
        </div>
      )}

      <div className={style.mcpHeader}>
        <Image src={mcp.icon} alt={mcp.name} />
        <div className={style.mcpInfo}>
          <h4>{mcp.name}</h4>
          <span className={style.version}>v{mcp.version}</span>
        </div>
      </div>

      <p className={style.description}>{mcp.description}</p>

      {mcp.Tools && mcp.Tools.length > 0 && (
        <div className={style.toolsInfo}>
          <span className={style.toolsCount}>
            {mcp.Tools.length} {mcp.Tools.length === 1 ? "Tool" : "Tools"}
          </span>
        </div>
      )}
    </div>
  );
};

export default McpSelectCard;
