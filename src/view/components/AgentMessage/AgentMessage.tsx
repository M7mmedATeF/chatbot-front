import type { Message } from "../../../types/room.entity";
import dayjs from "dayjs";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Button from "../Button/Button";
import { AiOutlineApi } from "react-icons/ai";
import { useMemo } from "react";
import Loader from "../Loader/Loader";

type AgentMessageProps = {
  message: Message;
  OnOpenMessages?: () => void;
};

const AgentMessage = ({ message, OnOpenMessages }: AgentMessageProps) => {
  const messageText = useMemo(() => {
    return (
      message?.Content?.map((content) => content.text)
        .join("")
        .trim() || ""
    );
  }, [message.Content]);

  return (
    <div className="message-container">
      <div className="message agent-message">
        {messageText.length > 0 ? (
          <MarkdownPreview className="msg-content" source={messageText} />
        ) : (
          <div>
            <Loader />
          </div>
        )}
        <p className="datetime">
          <span>{dayjs(message.createdAt).format("hh:mm A")}</span>
        </p>
      </div>

      {OnOpenMessages && (
        <Button
          className="mcp-message-btn tooltip tooltip-line"
          data-tooltip="MCP Tools"
          onClick={OnOpenMessages}
        >
          <AiOutlineApi />
        </Button>
      )}
    </div>
  );
};

export default AgentMessage;
