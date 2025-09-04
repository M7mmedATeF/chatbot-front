import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL mutation string
export const CreateRoomMutation = `
mutation CreateRoom($createRoomInput: CreateRoomInput!) {
    createRoom(createRoomInput: $createRoomInput) {
        id
        name
        createdAt
        updatedAt
    }
}
`;

// Types for the mutation variables
export interface CreateRoomInput {
  name: string;
}

export interface CreateRoomVariables {
  createRoomInput: CreateRoomInput;
}

// Types for the mutation response
export interface CreatedRoom {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomResponse {
  createRoom: CreatedRoom;
}

// Mutation function using AxiosFetch
export const createRoomMutation = async (
  variables: CreateRoomVariables
): Promise<CreateRoomResponse> => {
  const response = await AxiosFetch.post<ApiResponse<CreateRoomResponse>>("", {
    query: CreateRoomMutation,
    variables,
  });

  return response.data.data as CreateRoomResponse;
};
