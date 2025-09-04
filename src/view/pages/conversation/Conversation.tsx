import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useParams } from "react-router";
import Button from "../../components/Button/Button";
import "./Conversation.css";
import Textarea from "../../components/Textarea/Textarea";
import UserMessage from "../../components/UserMessage/UserMessage";
import AgentMessage from "../../components/AgentMessage/AgentMessage";
import Loader from "../../components/Loader/Loader";
import { useRoom } from "../../../hooks/useRoom";
import { useChat } from "../../../hooks/useChat";
import { useToolCallsBetweenMessages } from "../../../hooks/useToolCalls";
import type { MessageRole } from "../../../types/room.entity";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { AiOutlineArrowLeft } from "react-icons/ai";
import dayjs from "dayjs";

const Conversation = () => {
  const [showMCP, setShowMCP] = useState(false);
  const [showLiveCalls, setShowLiveCalls] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<
    number | string | null
  >(null);
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
    toolData,
    isConnected,
    isStreaming,
    sendMessage: sendChatMessage,
    cachedMessagesToolCalls,
  } = useChat({
    roomId: numericRoomId,
    onError: (error: any) => {
      toast.error("Chat error:", error?.message || "Something went wrong");
    },
    openMcpPanel: () => {
      setShowLiveCalls(true);
      setShowMCP(true);
    },
    dependencies: [roomId],
  });

  // Fetch tool calls between user messages
  const {
    data: toolCallsData,
    isLoading: loadingToolCalls,
    error: toolCallsError,
  } = useToolCallsBetweenMessages(selectedMessageId, cachedMessagesToolCalls);

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

  // Combine tool data sources: use streaming toolData if available, otherwise use fetched data
  const displayToolData = useMemo(() => {
    if (showLiveCalls && toolData.length > 0) {
      // Use streaming toolData
      return toolData.map((toolMsg) => ({
        id: uuidv4(),
        role: toolMsg.role,
        createdAt: dayjs(toolMsg.timestamp || new Date()).format("hh:mm A"),
        Content: (toolMsg as any).content,
      }));
    } else if (toolCallsData?.getToolCallsBetweenUserMessages) {
      // Use fetched data for completed messages
      return toolCallsData.getToolCallsBetweenUserMessages;
    }
    return [];
  }, [toolData, toolCallsData, showLiveCalls]);

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

  const showMessageProcessingCalls = (messageId: number | string) => {
    setShowLiveCalls(false);
    setSelectedMessageId(messageId);
    setShowMCP(true);
    // If message is streaming, use toolData directly (no DB fetch needed)
    // If message is not streaming, selectedMessageId will trigger the DB fetch via useToolCallsBetweenMessages
  };

  return (
    <section className="conversation-page">
      <div className="conversation-header glass-bg">
        <div className="user-actions">
          {showMCP && (
            <Button onClick={() => setShowMCP(false)}>
              <AiOutlineArrowLeft />
            </Button>
          )}
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
        </div>
      </div>
      <div className={`conversation-body-layout ${showMCP ? "show-mcp" : ""}`}>
        <div className="mcp-calls-container">
          <div className="glass-bg mcp-calls">
            <div className="mcp-header">
              <h3>Agent Actions</h3>
              {showLiveCalls && isStreaming && (
                <span className="streaming-indicator">🔴 Live</span>
              )}
              {toolCallsError && !isStreaming && (
                <p className="error-text">Error loading tool calls</p>
              )}
            </div>
            <div className="mcp-content">
              {loadingToolCalls && !showLiveCalls ? (
                <div className="loading-container">
                  <Loader />
                  <p>Loading agent actions...</p>
                </div>
              ) : displayToolData.length > 0 ? (
                <div className="tool-calls-list">
                  {displayToolData.map((toolCall, idx) => (
                    <div
                      key={`tool-call-${idx}-${toolCall.id}`}
                      className="tool-call-item"
                    >
                      <div className="tool-call-header">
                        <span className="tool-role">{toolCall.role}</span>
                        <span className="tool-time">{toolCall.createdAt}</span>
                      </div>
                      {(toolCall.Content || (toolCall as any).content).map(
                        (content: any, contentIdx: number) => (
                          <div
                            key={`content-${contentIdx}-${content.id}`}
                            className="tool-content"
                          >
                            {content.toolRequest && (
                              <div className="tool-request">
                                <h4>Tool Request</h4>
                                <pre>
                                  {JSON.stringify(content.toolRequest, null, 2)}
                                </pre>
                              </div>
                            )}
                            {content.toolResponse && (
                              <div className="tool-response">
                                <h4>Tool Response</h4>
                                <pre>
                                  {JSON.stringify(
                                    content.toolResponse,
                                    null,
                                    2
                                  )}
                                </pre>
                              </div>
                            )}
                            {content.text && (
                              <div className="tool-error">
                                <h4>Error</h4>
                                <pre>{content.text}</pre>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-tool-calls">
                  <p>No agent actions found for this message</p>
                </div>
              )}
            </div>
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
            ) : graphQLMessages.length > 0 ||
              chatMessagesFormatted.length > 0 ? (
              <>
                {/* Render useChat Messages */}
                {[...graphQLMessages, ...chatMessagesFormatted].map(
                  (msg, idx) => {
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
                          key={msg.id}
                          message={msg}
                          OnOpenMessages={() => {
                            showMessageProcessingCalls(msg.id);
                          }}
                        />
                      );
                    }

                    return null;
                  }
                )}
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
