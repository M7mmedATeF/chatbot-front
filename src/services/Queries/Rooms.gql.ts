import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL query string
export const RoomsQuery = `
query Rooms {
    rooms {
        createdAt
        id
        name
        updatedAt
    }
}
`;

// Types for the query variables
export interface RoomsVariables {
  workspaceId: string;
}

// Types for the query response
export interface GraphQLRoom {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomsResponse {
  rooms: GraphQLRoom[];
}

// Query function using AxiosFetch
export const fetchRooms = async (): Promise<RoomsResponse> => {
  const response = await AxiosFetch.post<ApiResponse<RoomsResponse>>("", {
    query: RoomsQuery,
  });

  return response.data.data as RoomsResponse;
};
