/* eslint-disable @typescript-eslint/no-explicit-any */
export type MessageRole =
  | "USER"
  | "MODEL"
  | "SYSTEM"
  | "TOOL_REQUEST"
  | "TOOL_RESPONSE";

export type ToolRequest = {
  ref: string;
  name: string;
  input: Record<string, any>;
};

export type ToolResponse = {
  ref: string;
  name: string;
  output: string | Record<string, any>;
};

export type Content = {
  id: number;
  text?: string | null;
  toolRequest?: ToolRequest | null;
  toolResponse?: ToolResponse | null;
  createdAt: Date;
};

export type ToolCall = {
  id: number;
  name: string;
  input?: Record<string, any>;
  output?: string | Record<string, any>;
};

export type Message = {
  id: number;
  role: MessageRole;
  Content: Content[];
  createdAt: Date;
};

export type Room = {
  id: number;
  name: string;
  message: Message[];
};
