import { create } from "zustand";
import type { Team } from "../types/team.entity";

export const useActiveTeam = create((set) => ({
  id: 0,
  name: "",
  addTeam: (ws: Team) => set(ws),
  removeTeam: () => set({ id: 0, name: "" }),
  updateTeam: (ws: Team) => set(ws),
}));
