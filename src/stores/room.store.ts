import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface RoomWithDates {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ActiveRoomState {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  setActiveRoom: (room: RoomWithDates) => void;
  clearActiveRoom: () => void;
}

const ACTIVE_ROOM_KEY = "room";

export const useActiveRoom = create<ActiveRoomState>()(
  persist(
    (set) => ({
      id: "",
      name: "",
      createdAt: "",
      updatedAt: "",
      setActiveRoom: (room: RoomWithDates) => {
        // Also store in sessionStorage for immediate access
        sessionStorage.setItem(ACTIVE_ROOM_KEY, room.id);
        set(room);
      },
      clearActiveRoom: () => {
        sessionStorage.removeItem(ACTIVE_ROOM_KEY);
        set({ id: "", name: "", createdAt: "", updatedAt: "" });
      },
    }),
    {
      name: ACTIVE_ROOM_KEY,
      storage: createJSONStorage(() => sessionStorage),
      // Only persist these fields
      partialize: (state) => ({
        id: state.id,
        name: state.name,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt,
      }),
    }
  )
);

// Helper function to get active room ID from sessionStorage
export const getActiveRoomId = (): string | null => {
  return sessionStorage.getItem(ACTIVE_ROOM_KEY);
};
