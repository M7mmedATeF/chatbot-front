import { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const Conversation = () => {
  const { roomId } = useParams();
  const numericRoomId = roomId ? parseInt(roomId, 10) : undefined;
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
    onError: (error: any) => {
      toast.error("Chat error:", error?.message || "Something went wrong");
    },
    dependencies: [roomId],
  });

  // Transform GraphQL messages to expected Message format
  const graphQLMessages = useMemo(() => {
    if (!roomData?.room?.Messages) return [];

    return roomData.room.Messages.map((msg) => ({
      id: msg.id,
      role: (msg.role === "AGENT" ? "MODEL" : msg.role) as MessageRole,
      createdAt: new Date(msg.createdAt),
      Content: msg.Content.map((content) => ({
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
      Content: msg.Content, // Already in the correct format
    }));
  }, [chatMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    // If streaming, only scroll if user is already near bottom (within 100px)
    if (isStreaming && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;

      if (isNearBottom) {
        // Small delay to ensure DOM updates
        setTimeout(scrollToBottom, 50);
      }
    } else {
      // For new messages (not streaming), always scroll to bottom
      setTimeout(scrollToBottom, 50);
    }
  }, [graphQLMessages.length, chatMessagesFormatted.length, isStreaming]);

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
            {graphQLMessages.length + chatMessagesFormatted.length} messages
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
        <div className="messages-list" ref={messagesContainerRef}>
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
          ) : graphQLMessages.length > 0 || chatMessagesFormatted.length > 0 ? (
            <>
              {/* Render GraphQL Messages */}
              {graphQLMessages.map((msg, idx) => {
                if (msg.role === "USER") {
                  return (
                    <UserMessage
                      key={`gql_${idx}_${msg.id}_${uuidv4()}`}
                      message={msg}
                    />
                  );
                }

                if (msg.role === "MODEL" || msg.role === "SYSTEM") {
                  return (
                    <AgentMessage
                      key={`gql_${idx}_${msg.id}_${uuidv4()}`}
                      message={msg}
                    />
                  );
                }

                if (
                  msg.role === "TOOL_REQUEST" ||
                  msg.role === "TOOL_RESPONSE"
                ) {
                  // Handle tool messages (only for GraphQL messages that have tool data)
                  const content = msg.Content[0];
                  if (
                    content &&
                    ("toolRequest" in content || "toolResponse" in content)
                  ) {
                    const toolCall: ToolCall = {
                      id: parseInt(`gql_${idx}_${msg.id}_${uuidv4()}`, 10),
                      name: content.toolRequest?.name || "Tool Call",
                      input: content.toolRequest?.input || {},
                      output: content.toolResponse?.output,
                    };
                    return (
                      <ToolCallMessage
                        key={`gql_${idx}_${msg.id}_${uuidv4()}`}
                        toolCall={toolCall}
                      />
                    );
                  }
                }

                return null;
              })}

              {/* Render useChat Messages */}
              {chatMessagesFormatted.map((msg, idx) => {
                if (msg.role === "USER") {
                  return (
                    <UserMessage
                      key={`chat_${idx}_${msg.id}_${uuidv4()}`}
                      message={msg}
                    />
                  );
                }

                if (msg.role === "MODEL" || msg.role === "SYSTEM") {
                  return (
                    <AgentMessage
                      key={`chat_${idx}_${msg.id}_${uuidv4()}`}
                      message={msg}
                    />
                  );
                }

                return null;
              })}
            </>
          ) : (
            <div className="empty-container">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
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
          {isStreaming ? (
            <>
              <Loader />
              <span>Sending...</span>
            </>
          ) : (
            "Send"
          )}
        </Button>
      </div>
    </section>
  );
};

export default Conversation;
