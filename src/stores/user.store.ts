import { create } from "zustand";
import type { LoginResponse } from "../services/Mutations/Auth.gql";

export const useUser = create((set) => ({
  user: {
    id: 0,
    name: "",
    email: "",
    createdAt: "",
  },
  setUser: (user: LoginResponse) => set({ user }),
  removeUser: () => set({ user: null }),
}));
