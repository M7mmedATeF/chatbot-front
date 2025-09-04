import { create } from "zustand";
import type { LoginResponse } from "../services/Mutations/Auth.gql";
import Cookies from "js-cookie";

export const useUser = create((set) => ({
  user: null,
  setUser: (user: LoginResponse) => set({ user }),
  removeUser: () => {
    Cookies.remove("USER");
    Cookies.remove("TOKEN");
    set({ user: null });
  },
}));
