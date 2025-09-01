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
            Contents {
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
  Contents: GraphQLContent[];
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
