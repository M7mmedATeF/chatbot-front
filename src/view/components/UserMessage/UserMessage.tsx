import type { Message } from "../../../types/room.entity";
import dayjs from "dayjs";

type UserMessageProps = {
  message: Message;
};

const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="message-container">
      <div className="message user-message">
        <p className="msg-content">
          {message.Content.map((content) => content.text).join("")}
        </p>
        <p className="datetime">
          <span>{dayjs(message.createdAt).format("hh:mm A")}</span>
        </p>
      </div>
    </div>
  );
};

export default UserMessage;
