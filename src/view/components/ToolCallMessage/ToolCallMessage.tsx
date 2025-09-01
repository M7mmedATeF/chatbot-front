import { useState } from "react";
import type { ToolCall } from "../../../types/room.entity";
import Loader from "../Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

type ToolCallProps = {
  toolCall: ToolCall;
};

const ToolCallMessage = ({ toolCall }: ToolCallProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="message-container">
      <div className="message tool-message">
        <div className="header" onClick={() => setIsOpen(!isOpen)}>
          {toolCall.output ? <FontAwesomeIcon icon={faCheck} /> : <Loader />}
          Call: {toolCall.name}
        </div>

        <div className={`details-view ${isOpen ? "open" : ""}`}>
          {toolCall.input && (
            <div className="input-view">
              <pre className="code" data-title="[input]" data-type="json">
                {JSON.stringify(toolCall.input, null, 2)}
              </pre>
            </div>
          )}
          {toolCall.output && (
            <div className="output-view">
              <pre className="code" data-title="[output]">
                {typeof toolCall.output === "string"
                  ? toolCall.output
                  : JSON.stringify(toolCall.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolCallMessage;
