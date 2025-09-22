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

// Register user mutation
export const UserRegisterMutation = `
mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    registerUser(registerInput: { name: $name, email: $email, password: $password }) {
        id
        name
        email
        createdAt
        updatedAt
        token
    }
}
`;

// Types for the mutation
export interface LoginVariables {
  email: string;
  password: string;
}

export interface RegisterVariables {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  registerUser: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    token: string;
  };
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

// Admin login mutation
export const AdminLoginMutation = `
mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(loginInput: { email: $email, password: $password }) {
        email
        id
        name
        token
        AdminAuditLog {
            action
            adminId
            createdAt
            id
            newValues
            oldValues
            recordId
            tableName
        }
    }
}
`;

// Types for admin login
export interface AdminLoginResponse {
  loginAdmin: {
    id: string;
    name: string;
    email: string;
    token: string;
    AdminAuditLog: {
      action: string;
      adminId: string;
      createdAt: string;
      id: string;
      newValues: string;
      oldValues: string;
      recordId: string;
      tableName: string;
    }[];
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
