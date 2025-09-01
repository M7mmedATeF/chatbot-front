import AxiosFetch from "../AxiosFetch";
import { UserLoginMutation, type LoginVariables } from "./Auth.gql";

export const UserLogin = async ({ email, password }: LoginVariables) => {
  const response = await AxiosFetch.post(import.meta.env.VITE_GQL_URL, {
    query: UserLoginMutation,
    variables: { email, password },
  });

  return response.data;
};
