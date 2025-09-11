import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL mutation string
export const UpdateUserMutation = `
mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
        id
        name
        email
        createdAt
        updatedAt
    }
}
`;

// GraphQL mutation string for password update
export const UpdateUserPasswordMutation = `
mutation UpdateUserPassword($updateUserPasswordInput: UpdateUserPasswordInput!) {
    updateUserPassword(updateUserPasswordInput: $updateUserPasswordInput) {
        id
        name
        email
        createdAt
        updatedAt
    }
}
`;

// Types for the mutation
export interface UpdateUserVariables {
  updateUserInput: {
    name?: string | null;
    email?: string | null;
  };
}

export interface UpdateUserResponse {
  updateUser: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Types for password update mutation
export interface UpdateUserPasswordVariables {
  updateUserPasswordInput: {
    oldPassword?: string | null;
    newPassword?: string | null;
  };
}

export interface UpdateUserPasswordResponse {
  updateUserPassword: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Mutation function for React Query
export const updateUserMutation = async (
  variables: UpdateUserVariables
): Promise<UpdateUserResponse> => {
  const response = await AxiosFetch.post<ApiResponse<UpdateUserResponse>>("", {
    query: UpdateUserMutation,
    variables,
  });

  return response.data.data as UpdateUserResponse;
};

// Mutation function for password update
export const updateUserPasswordMutation = async (
  variables: UpdateUserPasswordVariables
): Promise<UpdateUserPasswordResponse> => {
  const response = await AxiosFetch.post<
    ApiResponse<UpdateUserPasswordResponse>
  >("", {
    query: UpdateUserPasswordMutation,
    variables,
  });

  return response.data.data as UpdateUserPasswordResponse;
};
