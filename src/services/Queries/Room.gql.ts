import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL query string
export const RoomQuery = `
query Room($id: Int!) {
    room(id: $id) {
        id
        name
        createdAt
        updatedAt
        Messages {
            id
            role
            createdAt
            Content {
                id
                text
                toolRequest
                toolResponse
                createdAt
                updatedAt
            }
        }
    }
}
`;

// GraphQL query for rooms list
export const MyRoomsQuery = `
query MyRooms {
    myRooms {
        id
        name
        createdAt
        updatedAt
    }
}
`;

// Types for the query variables
export interface RoomVariables {
  id: number;
}

// Types for the query response
export interface GraphQLContent {
  id: number;
  text: string | null;
  toolRequest: any | null;
  toolResponse: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface GraphQLMessage {
  id: number;
  role: string;
  createdAt: string;
  Content: GraphQLContent[];
}

export interface GraphQLRoomDetails {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  Messages: GraphQLMessage[];
}

export interface RoomResponse {
  room: GraphQLRoomDetails;
}

// Types for MyRooms query response
export interface GraphQLRoomBasic {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyRoomsResponse {
  myRooms: GraphQLRoomBasic[];
}

// Query function using AxiosFetch
export const fetchRoom = async (
  variables: RoomVariables
): Promise<RoomResponse> => {
  const response = await AxiosFetch.post<ApiResponse<RoomResponse>>("", {
    query: RoomQuery,
    variables,
  });

  return response.data.data as RoomResponse;
};

// Query function for fetching rooms list
export const fetchMyRooms = async (): Promise<MyRoomsResponse> => {
  const response = await AxiosFetch.post<ApiResponse<MyRoomsResponse>>("", {
    query: MyRoomsQuery,
  });

  return response.data.data as MyRoomsResponse;
};

// GraphQL query for tool calls between user messages
export const ToolCallsBetweenUserMessagesQuery = `
query GetToolCallsBetweenUserMessages($messageId: Int!) {
    getToolCallsBetweenUserMessages(messageId: $messageId) {
        id
        role
        createdAt
        Content {
            id
            toolRequest
            toolResponse
            createdAt
            updatedAt
        }
    }
}
`;

// Types for tool calls between user messages query
export interface ToolCallsBetweenUserMessagesVariables {
  messageId: number;
}

export interface ToolCallsBetweenUserMessagesResponse {
  getToolCallsBetweenUserMessages: GraphQLMessage[];
}

// Query function for tool calls between user messages
export const fetchToolCallsBetweenUserMessages = async (
  variables: ToolCallsBetweenUserMessagesVariables
): Promise<ToolCallsBetweenUserMessagesResponse> => {
  const response = await AxiosFetch.post<
    ApiResponse<ToolCallsBetweenUserMessagesResponse>
  >("", {
    query: ToolCallsBetweenUserMessagesQuery,
    variables,
  });

  return response.data.data as ToolCallsBetweenUserMessagesResponse;
};
