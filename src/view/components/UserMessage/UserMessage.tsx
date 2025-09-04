import type { Message } from "../../../types/room.entity";
import dayjs from "dayjs";
import MarkdownPreview from "@uiw/react-markdown-preview";

type UserMessageProps = {
  message: Message;
};

const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="message-container">
      <div className="message user-message">
        <MarkdownPreview
          className="msg-content"
          source={message.Content.map((content) => content.text).join("")}
        />
        <p className="datetime">
          <span>{dayjs(message.createdAt).format("hh:mm A")}</span>
        </p>
      </div>
    </div>
  );
};

export default UserMessage;
