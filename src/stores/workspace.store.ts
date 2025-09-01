import { create } from "zustand";
import type { Workspace } from "../types/workspace.entity";

export const useActiveWorkspace = create((set) => ({
  id: 0,
  name: "",
  addWorskpace: (ws: Workspace) => set(ws),
  removeWorkspace: () => set({ id: 0, name: "" }),
  updateWorkspace: (ws: Workspace) => set(ws),
}));
