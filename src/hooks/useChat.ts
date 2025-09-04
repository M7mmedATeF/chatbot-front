import { useState, useCallback, useEffect, useRef } from "react";
import Cookies from "js-cookie";
// @ts-expect-error - no types
import { fetchEventSource } from "@sentool/fetch-event-source";
import type { Content } from "../types/room.entity";
import type { ToolCallsBetweenUserMessagesResponse } from "../services/Queries/Room.gql";

export interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM" | "ERROR";
  Content: Content[];
  timestamp: Date;
  isStreaming?: boolean;
}

interface UseChatOptions {
  roomId: number | undefined;
  onError?: (error: Error) => void;
  onMessage?: (message: ChatMessage) => void;
  dependencies?: any[];
  openMcpPanel: () => void;
}

export const useChat = ({
  roomId,
  onError,
  onMessage,
  dependencies,
  openMcpPanel,
}: UseChatOptions) => {
  const [cachedMessagesToolCalls, setCachedMessagesToolCalls] = useState<
    Record<string, ToolCallsBetweenUserMessagesResponse[]>
  >({});
  const [toolData, setToolData] = useState<ChatMessage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<ChatMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const eventSourceRef = useRef<{ close: () => void } | null>(null);
  const newMessageRef = useRef<ChatMessage | null>(null);
  const toolCallsRef = useRef<ChatMessage[]>(null);

  // keep ref synced with state
  useEffect(() => {
    newMessageRef.current = newMessage;
  }, [newMessage]);

  // keep ref synced with toolData
  useEffect(() => {
    toolCallsRef.current = toolData;
  }, [toolData]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close?.();
      eventSourceRef.current = null;
    };
  }, [roomId]);

  useEffect(() => {
    setMessages([]);
    setNewMessage(null);
    setIsConnected(false);
    setIsStreaming(false);
    eventSourceRef.current = null;
  }, [...(dependencies || [])]);

  const finishStreaming = useCallback(() => {
    const latest = newMessageRef.current;

    setIsStreaming(false);
    if (latest) {
      setMessages((prev) => [...prev, { ...latest, isStreaming: false }]);
      setNewMessage(null);
      newMessageRef.current = null;
    }
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!roomId || !text.trim()) return;

      eventSourceRef.current?.close?.();
      setIsStreaming(true);

      // user message
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "USER",
        Content: [
          {
            id: Date.now(),
            text: text.trim(),
            createdAt: new Date(),
            toolRequest: null,
            toolResponse: null,
          },
        ],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // assistant streaming message
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "ASSISTANT",
        Content: [
          {
            id: Date.now(),
            text: "",
            createdAt: new Date(),
            toolRequest: null,
            toolResponse: null,
          },
        ],
        timestamp: new Date(),
        isStreaming: true,
      };
      setNewMessage(assistantMsg);
      newMessageRef.current = assistantMsg;

      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = Cookies.get("TOKEN");
        const ws = JSON.parse(sessionStorage.getItem("workspace") || "{}");
        const team = JSON.parse(sessionStorage.getItem("team") || "{}");
        const room = JSON.parse(sessionStorage.getItem("room") || "{}");

        const url = `${apiUrl}/room/send-message?roomId=${roomId}&message=${encodeURIComponent(
          text.trim()
        )}`;

        const eventSource = fetchEventSource(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            workspaceid: ws?.state?.id,
            teamid: team?.state?.id,
            roomid: room?.state?.id,
          },
          onopen: async (res: Response) => {
            if (!res.ok) throw new Error(`Failed to connect: ${res.status}`);
            setIsConnected(true);
            setToolData([]);
          },
          onmessage: (event: any) => {
            try {
              const data = event.data;
              console.log(data, event);

              if (!data) return;

              if (data.content?.length) {
                if (
                  data.content[0].toolRequest ||
                  data.content[0].toolResponse
                ) {
                  if (toolData.length == 0) {
                    openMcpPanel();
                  }
                  setToolData((prev) => [
                    ...prev,
                    { ...data, timestamp: new Date() },
                  ]);
                } else {
                  setNewMessage((prev) => {
                    if (!prev) return prev;
                    const updated = {
                      ...prev,
                      Content: [...prev.Content, ...data.content],
                    };
                    newMessageRef.current = updated;
                    return updated;
                  });
                }
                onMessage?.({ ...assistantMsg, isStreaming: true });
              } else if (typeof data === "string") {
                setNewMessage(null);
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `error-${Date.now()}`,
                    role: "ERROR",
                    timestamp: new Date(),
                    content: [
                      {
                        id: Date.now(),
                        text:
                          typeof data === "string"
                            ? data
                            : JSON.stringify(data),
                        createdAt: new Date(),
                      },
                    ],
                  } as any,
                ]);
                setToolData((prev) => [
                  ...prev,
                  {
                    id: `error-${Date.now()}`,
                    role: "ERROR",
                    timestamp: new Date(),
                    content: [
                      {
                        id: Date.now(),
                        text:
                          typeof data === "string"
                            ? data
                            : JSON.stringify(data),
                        createdAt: new Date(),
                      },
                    ],
                  } as any,
                ]);

                throw new Error(data);
              }
            } catch {
              finishStreaming();
              onError?.(new Error("Failed to parse SSE data"));
            }
          },
          done: () => {
            finishStreaming();
            setCachedMessagesToolCalls((prev) => {
              const newCachedMessagesToolCalls = { ...prev };
              newCachedMessagesToolCalls[assistantMsg.id] =
                toolCallsRef.current as any;
              return newCachedMessagesToolCalls;
            });
          },
          onerror: (err: any) => {
            console.error("fetchEventSource error:", err);
            setIsConnected(false);
            finishStreaming();
            onError?.(new Error("Connection failed"));
          },
        });

        eventSourceRef.current = eventSource;
      } catch (err) {
        finishStreaming();
        onError?.(err as Error);
      }
    },
    [roomId, onError, onMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setNewMessage(null);
    newMessageRef.current = null;
    eventSourceRef.current?.close?.();
    eventSourceRef.current = null;
  }, []);

  return {
    messages: [...messages, ...(newMessage ? [newMessage] : [])],
    toolData,
    isConnected,
    isStreaming,
    sendMessage,
    clearMessages,
    cachedMessagesToolCalls,
  };
};
