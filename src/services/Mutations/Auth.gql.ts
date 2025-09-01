// GraphQL mutation string
export const UserLoginMutation = `
mutation LoginUszer($email: String!, $password: String!) {
    loginUser(loginInput: { email: $email, password: $password }) {
        id
        name
        email
        createdAt
        token
    }
}
`;

// Types for the mutation
export interface LoginVariables {
  email: string;
  password: string;
}

export interface LoginResponse {
  loginUser: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    token: string;
  };
}

// Mutation function for React Query
export const loginUserMutation = async (
  variables: LoginVariables
): Promise<LoginResponse> => {
  const response = await fetch("/graphql", {
    // Adjust the endpoint as needed
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UserLoginMutation,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
};
