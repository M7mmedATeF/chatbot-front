import { useState, useEffect, useCallback, useRef } from "react";

export interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface UseChatOptions {
  roomId: number | undefined;
  onError?: (error: Error) => void;
  onMessage?: (message: ChatMessage) => void;
}

export const useChat = ({ roomId, onError, onMessage }: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [, setCurrentStreamingMessage] = useState<ChatMessage | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);

  // Clean up EventSource on unmount or roomId change
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [roomId]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!roomId || !message.trim()) return;

      // Close any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      setIsStreaming(true);

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "USER",
        content: message.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Create streaming assistant message
      const assistantMessageId = `assistant-${Date.now()}`;
      streamingMessageIdRef.current = assistantMessageId;

      const streamingMessage: ChatMessage = {
        id: assistantMessageId,
        role: "ASSISTANT",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setCurrentStreamingMessage(streamingMessage);
      setMessages((prev) => [...prev, streamingMessage]);

      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const url = `${apiUrl}/room/send-message?roomId=${roomId}&message=${encodeURIComponent(
          message.trim()
        )}`;

        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === "chunk") {
              // Handle streaming text chunks
              setCurrentStreamingMessage((prev) => {
                if (!prev) return null;

                const updatedMessage = {
                  ...prev,
                  content: prev.content + data.content,
                };

                // Update the message in the messages array
                setMessages((prevMessages) =>
                  prevMessages.map((msg) =>
                    msg.id === prev.id ? updatedMessage : msg
                  )
                );

                return updatedMessage;
              });

              onMessage?.({
                id: assistantMessageId,
                role: "ASSISTANT",
                content: data.content,
                timestamp: new Date(),
                isStreaming: true,
              });
            } else if (data.type === "done") {
              // Handle completion
              setCurrentStreamingMessage((prev) => {
                if (!prev) return null;

                const completedMessage = {
                  ...prev,
                  isStreaming: false,
                };

                // Update the message in the messages array
                setMessages((prevMessages) =>
                  prevMessages.map((msg) =>
                    msg.id === prev.id ? completedMessage : msg
                  )
                );

                return null;
              });

              setIsStreaming(false);
              streamingMessageIdRef.current = null;

              onMessage?.({
                id: assistantMessageId,
                role: "ASSISTANT",
                content: data.content || "",
                timestamp: new Date(),
                isStreaming: false,
              });
            } else if (data.type === "error") {
              // Handle errors
              console.error("SSE Error:", data.error);
              setIsStreaming(false);
              setCurrentStreamingMessage(null);
              streamingMessageIdRef.current = null;

              onError?.(new Error(data.error || "Unknown error occurred"));
            }
          } catch (error) {
            console.error("Failed to parse SSE message:", error);
            onError?.(new Error("Failed to parse server response"));
          }
        };

        eventSource.onerror = (error) => {
          console.error("EventSource error:", error);
          setIsConnected(false);
          setIsStreaming(false);
          setCurrentStreamingMessage(null);
          streamingMessageIdRef.current = null;

          onError?.(new Error("Connection failed"));
        };
      } catch (error) {
        console.error("Failed to create EventSource:", error);
        setIsStreaming(false);
        setCurrentStreamingMessage(null);
        streamingMessageIdRef.current = null;

        onError?.(error as Error);
      }
    },
    [roomId, onError, onMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentStreamingMessage(null);
    streamingMessageIdRef.current = null;

    // Close any active connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  return {
    messages,
    isConnected,
    isStreaming,
    sendMessage,
    clearMessages,
  };
};
