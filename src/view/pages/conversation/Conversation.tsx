import { useState, useMemo, useCallback } from "react";
import { useParams } from "react-router";
import Button from "../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Conversation.css";
import Textarea from "../../components/Textarea/Textarea";
import UserMessage from "../../components/UserMessage/UserMessage";
import AgentMessage from "../../components/AgentMessage/AgentMessage";
import ToolCallMessage from "../../components/ToolCallMessage/ToolCallMessage";
import Loader from "../../components/Loader/Loader";
import { useRoom } from "../../../hooks/useRoom";
import { useChat } from "../../../hooks/useChat";
import type { ToolCall, MessageRole } from "../../../types/room.entity";

const Conversation = () => {
  const { roomId } = useParams();
  const numericRoomId = roomId ? parseInt(roomId, 10) : undefined;
  const [message, setMessage] = useState("");

  // Fetch room data with messages
  const {
    data: roomData,
    isLoading: loadingRoom,
    error: roomError,
  } = useRoom(numericRoomId);

  // Chat hook for real-time messaging
  const {
    messages: chatMessages,
    isConnected,
    isStreaming,
    sendMessage: sendChatMessage,
  } = useChat({
    roomId: numericRoomId,
    onError: (error) => {
      console.error("Chat error:", error);
      // You could show a toast notification here
    },
  });

  // Transform GraphQL messages to expected Message format
  const graphQLMessages = useMemo(() => {
    if (!roomData?.room?.Messages) return [];

    return roomData.room.Messages.map((msg) => ({
      id: msg.id,
      role: (msg.role === "AGENT" ? "MODEL" : msg.role) as MessageRole,
      createdAt: new Date(msg.createdAt),
      contents: msg.Contents.map((content) => ({
        id: content.id,
        text: content.text,
        toolRequest: content.toolRequest,
        toolResponse: content.toolResponse,
        createdAt: new Date(content.createdAt),
      })),
    }));
  }, [roomData]);

  // Transform chat messages to expected Message format
  const chatMessagesFormatted = useMemo(() => {
    return chatMessages.map((msg) => ({
      id: parseInt(msg.id.split("-")[1] || msg.id, 10), // Extract numeric ID from chat message ID
      role: (msg.role === "ASSISTANT"
        ? "MODEL"
        : msg.role === "USER"
        ? "USER"
        : "SYSTEM") as MessageRole,
      createdAt: msg.timestamp,
      contents: [
        {
          id: parseInt(msg.id.split("-")[1] || msg.id, 10),
          createdAt: msg.timestamp,
          text: msg.content,
          toolRequest: null,
          toolResponse: null,
        },
      ],
    }));
  }, [chatMessages]);

  // Combine all messages
  const allMessages = useMemo(() => {
    return [...graphQLMessages, ...chatMessagesFormatted];
  }, [graphQLMessages, chatMessagesFormatted]);

  const sendMessage = useCallback(() => {
    if (message.trim() && !isStreaming) {
      sendChatMessage(message.trim());
      setMessage("");
    }
  }, [message, isStreaming, sendChatMessage]);

  return (
    <section className="conversation-page">
      <div className="conversation-header glass-bg">
        <div>
          <p className="name">
            {loadingRoom
              ? "Loading..."
              : roomData?.room?.name || "Conversation"}
          </p>
          <p className="token-usage">
            {allMessages.length} messages
            {isStreaming && (
              <span className="streaming-indicator"> • Streaming</span>
            )}
          </p>
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
          {loadingRoom ? (
            <div className="loading-container">
              <Loader />
              <p>Loading conversation...</p>
            </div>
          ) : roomError ? (
            <div className="error-container">
              <p>Error loading conversation</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : allMessages.length > 0 ? (
            allMessages.map((msg) => {
              if (msg.role === "USER") {
                return <UserMessage key={msg.id} message={msg} />;
              }

              if (msg.role === "MODEL" || msg.role === "SYSTEM") {
                return <AgentMessage key={msg.id} message={msg} />;
              }

              if (msg.role === "TOOL_REQUEST" || msg.role === "TOOL_RESPONSE") {
                // Handle tool messages (only for GraphQL messages that have tool data)
                const content = msg.contents[0];
                if (
                  content &&
                  ("toolRequest" in content || "toolResponse" in content)
                ) {
                  const toolCall: ToolCall = {
                    id: msg.id,
                    name: content.toolRequest?.name || "Tool Call",
                    input: content.toolRequest?.input || {},
                    output: content.toolResponse?.output,
                  };
                  return <ToolCallMessage key={msg.id} toolCall={toolCall} />;
                }
              }

              return null;
            })
          ) : (
            <div className="empty-container">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>
      <div className="conversation-footer">
        <Textarea
          placeholder={
            isStreaming
              ? "Waiting for response..."
              : isConnected
              ? "Enter your message"
              : "Connecting..."
          }
          value={message}
          disabled={isStreaming}
          onChange={(e: any) => setMessage(e)}
          onKeyDown={(e: any) => {
            if (e.key === "Enter" && e.ctrlKey && !isStreaming) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <Button
          theme="borderd"
          onClick={sendMessage}
          disabled={isStreaming || !message.trim()}
        >
          {isStreaming ? "Sending..." : "Send"}
        </Button>
      </div>
    </section>
  );
};

export default Conversation;
