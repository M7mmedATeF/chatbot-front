import { useQuery } from "@tanstack/react-query";
import {
  fetchToolCallsBetweenUserMessages,
  type ToolCallsBetweenUserMessagesResponse,
} from "../services/Queries/Room.gql";
import { v4 as uuidv4 } from "uuid";

// Hook for fetching tool calls between user messages
export const useToolCallsBetweenMessages = (
  messageId: number | string | null,
  cachedMessagesToolCalls: Record<
    string,
    any // Can be either ChatMessage[] or ToolCallsBetweenUserMessagesResponse
  >
) => {
  const messageIdString = String(messageId);
  const cachedData = cachedMessagesToolCalls[`assistant-${messageIdString}`];

  const hasCachedData = !!cachedData;

  // Format cached data to match API response structure
  const formatCachedData = (
    data: any
  ): ToolCallsBetweenUserMessagesResponse | null => {
    if (!data) return null;

    // If data is already in the correct format
    if (data.getToolCallsBetweenUserMessages) {
      return data;
    }

    // If data is an array of ChatMessage objects (from streaming)
    if (Array.isArray(data)) {
      return {
        getToolCallsBetweenUserMessages: data.map((msg: any) => ({
          id: msg.id || uuidv4(),
          role: msg.role,
          createdAt: msg.timestamp || new Date().toISOString(),
          Content: msg.content || msg.Content || [],
        })),
      };
    }

    return null;
  };

  const formattedCachedData = formatCachedData(cachedData);

  return useQuery({
    queryKey: ["toolCallsBetweenMessages", messageId],
    queryFn: () =>
      fetchToolCallsBetweenUserMessages({ messageId: Number(messageId) }),
    enabled: !!messageId && !hasCachedData, // Only run query if messageId is valid AND no cached data exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: formattedCachedData || undefined,
  });
};
