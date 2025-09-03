import type { Message } from "../../../types/room.entity";
import dayjs from "dayjs";
import MarkdownPreview from '@uiw/react-markdown-preview';

type AgentMessageProps = {
  message: Message;
};

const AgentMessage = ({ message }: AgentMessageProps) => {
  return (
    <div className="message-container">
      <div className="message agent-message">
        <p className="msg-content">
          <MarkdownPreview source={message.Content.map((content) => content.text).join("")} />
        </p>
        <p className="datetime">
          <span>{dayjs(message.createdAt).format("hh:mm A")}</span>
        </p>
      </div>
    </div>
  );
};

export default AgentMessage;
