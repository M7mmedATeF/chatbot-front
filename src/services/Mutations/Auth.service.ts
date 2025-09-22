import AxiosFetch from "../AxiosFetch";
import {
  UserLoginMutation,
  AdminLoginMutation,
  UserRegisterMutation,
  type LoginVariables,
  type RegisterVariables,
} from "./Auth.gql";

export const UserLogin = async ({ email, password }: LoginVariables) => {
  const response = await AxiosFetch.post(import.meta.env.VITE_GQL_URL, {
    query: UserLoginMutation,
    variables: { email, password },
  });

  return response.data;
};

export const AdminLogin = async ({ email, password }: LoginVariables) => {
  const response = await AxiosFetch.post(import.meta.env.VITE_GQL_URL, {
    query: AdminLoginMutation,
    variables: { email, password },
  });

  return response.data;
};

export const UserRegister = async ({
  name,
  email,
  password,
}: RegisterVariables) => {
  const response = await AxiosFetch.post(import.meta.env.VITE_GQL_URL, {
    query: UserRegisterMutation,
    variables: { name, email, password },
  });

  return response.data;
};
