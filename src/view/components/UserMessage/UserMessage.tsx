import type { Message } from "../../../types/room.entity";

type UserMessageProps = {
  message: Message;
};

const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="message-container">
      <div className="message user-message">
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

export default UserMessage;
