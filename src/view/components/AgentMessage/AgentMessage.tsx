import type { Message } from "../../../types/room.entity";

type AgentMessageProps = {
  message: Message;
};

const AgentMessage = ({ message }: AgentMessageProps) => {
  return (
    <div className="message-container">
      <div className="message agent-message">
        <p className="msg-content">
          {message.contents.map((content) => content.text).join("")}
        </p>
        <p className="datetime">
          <span>{message.createdAt.toLocaleTimeString()}</span>
        </p>
      </div>
    </div>
  );
};

export default AgentMessage;
