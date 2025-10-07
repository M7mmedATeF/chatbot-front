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
import { Virtuoso } from "react-virtuoso";

const Conversation = () => {
  const [showLiveCalls, setShowLiveCalls] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<
    number | string | null
  >(null);
  const { roomId } = useParams();
  const numericRoomId = roomId ? parseInt(roomId, 10) : undefined;
  const [message, setMessage] = useState("");
  const virtuosoRef = useRef<any>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [displayedMessagesCount, setDisplayedMessagesCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
      setTabSize(defaultSize);
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

  // All combined messages (full list)
  const fullMessagesList = useMemo(() => {
    return [...graphQLMessages, ...chatMessagesFormatted];
  }, [graphQLMessages, chatMessagesFormatted]);

  // Messages to display (limited by displayedMessagesCount)
  const allMessages = useMemo(() => {
    const totalMessages = fullMessagesList.length;
    const startIndex = Math.max(0, totalMessages - displayedMessagesCount);
    return fullMessagesList.slice(startIndex);
  }, [fullMessagesList, displayedMessagesCount]);

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
    if (shouldAutoScroll && virtuosoRef.current) {
      // Small delay to ensure DOM updates
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: allMessages.length - 1,
          behavior: "smooth",
          align: "end",
        });
      }, 50);
    }
  }, [allMessages.length, shouldAutoScroll, isStreaming]);

  // Reset displayed count when switching rooms
  useEffect(() => {
    setDisplayedMessagesCount(5);
  }, [roomId]);

  // Load more messages when scrolling to top
  const loadMoreMessages = useCallback(() => {
    if (isLoadingMore || displayedMessagesCount >= fullMessagesList.length) {
      return;
    }

    setIsLoadingMore(true);

    // Simulate loading delay (you can remove this if you want instant loading)
    setTimeout(() => {
      setDisplayedMessagesCount((prev) =>
        Math.min(prev + 5, fullMessagesList.length)
      );
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, displayedMessagesCount, fullMessagesList.length]);

  const sendMessage = useCallback(() => {
    if (message.trim() && !isStreaming) {
      sendChatMessage(message.trim());
      setMessage("");
    }
  }, [message, isStreaming, sendChatMessage]);

  const showMessageProcessingCalls = (messageId: number | string | null) => {
    if (messageId === null) {
      setShowLiveCalls(false);
      setSelectedMessageId(null);
      setTabSize(0);
      return;
    }
    setShowLiveCalls(false);
    setSelectedMessageId(messageId);
    setTabSize(defaultSize);
    // If message is streaming, use toolData directly (no DB fetch needed)
    // If message is not streaming, selectedMessageId will trigger the DB fetch via useToolCallsBetweenMessages
  };

  const [defaultSize, setDefaultSize] = useState(0);
  const [tabSize, setTabSize] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const handleDrawerMove = useCallback(
    (e: MouseEvent) => {
      if (isClicked) {
        setTabSize(
          tabContainerRef?.current
            ? Math.min(
                tabContainerRef?.current?.getBoundingClientRect().width / 3 +
                  tabContainerRef?.current?.getBoundingClientRect().left,
                e.clientX
              )
            : e.clientX
        );
      }
    },
    [isClicked]
  );

  useEffect(() => {
    if (defaultSize == 0) {
      const boundry = tabContainerRef?.current?.getBoundingClientRect() || {
        left: 1500,
        width: 0,
      };
      setDefaultSize(boundry?.left + boundry?.width / 3);
      return;
    }

    if (tabContainerRef.current) {
      if (tabSize == 0) {
        tabContainerRef.current.style.gridTemplateColumns = `0px minmax(0, 1fr)`;
      }

      const containerBoundry = tabContainerRef.current.getBoundingClientRect();
      let ratio =
        tabSize < containerBoundry.left
          ? tabSize
          : tabSize - containerBoundry.left;

      if (ratio <= 50) {
        ratio = 0;
        setTabSize(0);
      }
      tabContainerRef.current.style.gridTemplateColumns = `${ratio}px minmax(0, 1fr)`;
    }
  }, [tabSize]);

  useEffect(() => {
    showMessageProcessingCalls(null);
    console.log("close");
  }, [roomId]);

  return (
    <section
      className="conversation-page"
      onMouseUp={() => setIsClicked(false)}
      onMouseLeave={() => setIsClicked(false)}
      onMouseMove={(e) => handleDrawerMove(e as any)}
    >
      <div className="conversation-header glass-bg">
        <div className="user-actions">
          {tabSize > 150 && (
            <Button onClick={() => setTabSize(0)}>
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
              {fullMessagesList.length} messages
              {allMessages.length < fullMessagesList.length && (
                <span> (showing last {allMessages.length})</span>
              )}
              {isStreaming && (
                <span className="streaming-indicator"> • Streaming</span>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className={`conversation-body-layout`} ref={tabContainerRef}>
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
                        <span className="tool-time">
                          {dayjs(toolCall.createdAt).format("hh:mm A")}
                        </span>
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
          <div className="drawer" onMouseDown={() => setIsClicked(true)}></div>
        </div>

        <div className="conversation-body">
          {loadingRoom ? (
            <div className="messages-list">
              <div className="loading-container">
                <Loader />
                <p>Loading conversation...</p>
              </div>
            </div>
          ) : roomError ? (
            <div className="messages-list">
              <div className="error-container">
                <p>Error loading conversation</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </div>
          ) : allMessages.length > 0 ? (
            <Virtuoso
              className="messages-list"
              ref={virtuosoRef}
              style={{ height: "100%" }}
              data={allMessages}
              initialTopMostItemIndex={allMessages.length - 1}
              followOutput="smooth"
              atBottomStateChange={(atBottom) => {
                setShouldAutoScroll(atBottom);
              }}
              startReached={loadMoreMessages}
              components={{
                Header: () =>
                  displayedMessagesCount < fullMessagesList.length ? (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      {isLoadingMore ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader />
                          <span>Loading more messages...</span>
                        </div>
                      ) : (
                        <Button onClick={loadMoreMessages} theme="secondary">
                          Load{" "}
                          {Math.min(
                            5,
                            fullMessagesList.length - displayedMessagesCount
                          )}{" "}
                          more messages
                        </Button>
                      )}
                    </div>
                  ) : displayedMessagesCount >= fullMessagesList.length &&
                    fullMessagesList.length > 5 ? (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      <p>All messages loaded</p>
                    </div>
                  ) : null,
                EmptyPlaceholder: () => (
                  <div className="empty-container">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ),
              }}
              itemContent={(index, msg) => {
                if (msg.role === "USER") {
                  return (
                    <UserMessage
                      key={`chat_${index}_${msg.id}_${uuidv4()}`}
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
              }}
            />
          ) : (
            <div className="messages-list">
              <div className="empty-container">
                <p>No messages yet. Start the conversation!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="conversation-footer glass-bg">
        <Textarea
          placeholder={
            isStreaming ? "Waiting for response..." : "Enter your message"
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
