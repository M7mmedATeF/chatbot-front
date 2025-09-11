import { create } from "zustand";
import type { LoginResponse } from "../services/Mutations/Auth.gql";
import type { UpdateUserResponse } from "../services/Mutations/User.gql";
import Cookies from "js-cookie";

export const useUser = create((set) => ({
  user: null,
  setUser: (user: LoginResponse) => set({ user }),
  updateUser: (updatedUser: UpdateUserResponse["updateUser"]) => {
    set({ user: updatedUser });
    Cookies.set("USER", JSON.stringify(updatedUser));
  },
  removeUser: () => {
    Cookies.remove("USER");
    Cookies.remove("TOKEN");
    set({ user: null });
  },
}));
