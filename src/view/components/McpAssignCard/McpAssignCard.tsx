import style from "./McpAssignCard.module.css";
import type { AvailableWsMcpItem } from "../../../services/Queries/Workspaces.gql";
import Image from "../Image/Image";
import Toggle from "../Toggle/Toggle";
import Checkbox from "../Checkbox/Checkbox";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { useState } from "react";

const McpAssignCard = ({ mcp }: { mcp: AvailableWsMcpItem }) => {
  const [showAssign, setShowAssign] = useState(false);
  return (
    <div className={`${style.mcpAssignCard} glass-bg`}>
      <div className={style.card_head}>
        <div className={style.head_info}>
          <Image className="avatar" />
          <p>{mcp.name}</p>
        </div>

        <div>
          <Toggle
            checked={showAssign}
            onChange={(e: any) => setShowAssign(e)}
            
          />
        </div>
      </div>

      <div className={style.description}>
        <p>{mcp.description}</p>
      </div>

      {showAssign && mcp.Tools.length > 0 && (
        <div className={style.mcp_list_box}>
          <h4>Tools</h4>
          <div className={style.tools_list}>
            {mcp.Tools.map((tool) => (
              <Checkbox key={tool.id} theme="primary">
                {tool.name}
              </Checkbox>
            ))}
          </div>
        </div>
      )}

      {showAssign && mcp.Requirements.length > 0 && (
        <div className={style.mcp_list_box}>
          <h4>API Configuration</h4>
          <div className={style.api_config_list}>
            {mcp.Requirements.map((req) => (
              <Input key={req.id} label={req.key} placeholder="Enter token" />
            ))}
          </div>
        </div>
      )}

      {showAssign && (
        <Button theme="primary" className={style.assign_btn}>
          Assign
        </Button>
      )}
    </div>
  );
};

export default McpAssignCard;
