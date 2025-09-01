import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WorkspaceWithDate {
  id: string;
  name: string;
  createdAt: string;
}

interface ActiveWorkspaceState {
  id: string;
  name: string;
  createdAt: string;
  setActiveWorkspace: (ws: WorkspaceWithDate) => void;
  clearActiveWorkspace: () => void;
}

const ACTIVE_WORKSPACE_KEY = "workspace";

export const useActiveWorkspace = create<ActiveWorkspaceState>()(
  persist(
    (set) => ({
      id: "",
      name: "",
      createdAt: "",
      setActiveWorkspace: (ws: WorkspaceWithDate) => {
        // Also store in sessionStorage for immediate access
        sessionStorage.setItem(ACTIVE_WORKSPACE_KEY, ws.id);
        set(ws);
      },
      clearActiveWorkspace: () => {
        sessionStorage.removeItem(ACTIVE_WORKSPACE_KEY);
        set({ id: "", name: "", createdAt: "" });
      },
    }),
    {
      name: ACTIVE_WORKSPACE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      // Only persist these fields
      partialize: (state) => ({
        id: state.id,
        name: state.name,
        createdAt: state.createdAt,
      }),
    }
  )
);

// Helper function to get active workspace ID from sessionStorage
export const getActiveWorkspaceId = (): string | null => {
  return sessionStorage.getItem(ACTIVE_WORKSPACE_KEY);
};
