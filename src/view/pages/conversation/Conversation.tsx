import { useState } from "react";
import Button from "../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Conversation.css";
import Textarea from "../../components/Textarea/Textarea";
import UserMessage from "../../components/UserMessage/UserMessage";
import AgentMessage from "../../components/AgentMessage/AgentMessage";
import ToolCallMessage from "../../components/ToolCallMessage/ToolCallMessage";
import type { Message, ToolCall } from "../../../types/room.entity";

const Conversation = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "USER",
      createdAt: new Date(),
      contents: [
        {
          id: 1,
          createdAt: new Date(),
          text: "Hello",
        },
      ],
    },
    {
      id: 2,
      role: "AGENT",
      createdAt: new Date(),
      contents: [
        {
          id: 1,
          createdAt: new Date(),
          text: "Hello",
        },
      ],
    },
    {
      id: 3,
      role: "TOOL_CALL",
      createdAt: new Date(),
      contents: [
        {
          id: 1,
          createdAt: new Date(),
          toolCall: {
            id: 1,
            name: "Calculate BMI",
            input: { name: "John Doe", age: "23" },
            output: "23",
          },
        },
      ],
    },
    {
      id: 3,
      role: "TOOL_CALL",
      createdAt: new Date(),
      contents: [
        {
          id: 1,
          createdAt: new Date(),
          toolCall: {
            id: 1,
            name: "Calculate BMI",
            input: {},
          },
        },
      ],
    },
  ]);

  const sendMessage = () => {
    if (message) {
      setMessages((m) => [
        ...m,
        {
          id: m.length + 1,
          role: "USER",
          createdAt: new Date(),
          contents: [
            {
              id: m.length + 1,
              createdAt: new Date(),
              text: message,
            },
          ],
        },
      ]);
    }
  };

  return (
    <section className="conversation-page">
      <div className="conversation-header glass-bg">
        <div>
          <p className="name">Conversation Name</p>
          <p className="token-usage">1,842,365 Token</p>
        </div>

        <div className="conversation-actions">
          <Button>
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          <Button>
            <FontAwesomeIcon icon={faBars} />
          </Button>
        </div>
      </div>
      <div className="conversation-body">
        <div className="messages-list">
          {messages.length > 0 &&
            messages.map((msg) => {
              if (msg.role === "USER") {
                return <UserMessage message={msg as Message} />;
              }

              if (msg.role === "AGENT") {
                return <AgentMessage message={msg as Message} />;
              }

              if (msg.role === "TOOL_CALL") {
                return (
                  <ToolCallMessage
                    toolCall={(msg.contents[0] as any).toolCall as ToolCall}
                  />
                );
              }
            })}
        </div>
      </div>
      <div className="conversation-footer">
        <Textarea
          placeholder="Enter your message"
          value={message}
          onChange={(e: any) => setMessage(e)}
          onKeyDown={(e: any) => {
            if (e.key === "Enter" && e.ctrlKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <Button theme="borderd" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </section>
  );
};

export default Conversation;
