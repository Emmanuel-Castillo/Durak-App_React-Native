import { useAuthStore } from "@/store/auth.store";
import { Room } from "@/types";
import { Alert } from "react-native";
import { create } from "zustand";
import { SocketStatus, useSocketStore } from "./socket.store";

type RoomState = {
  room: Room | null;
  roomLoading: boolean;

  subscribeToRoomEvents: () => void;
  createRoom: (roomName: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  removeFromRoom: (playerId: string) => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  room: null,
  roomLoading: false,
  subscribeToRoomEvents: () => {
    try {
      const user = useAuthStore.getState().user;
      const { socket, connectionStatus } = useSocketStore.getState();
      if (!user || !socket) throw new Error("User or socket are not set.");
      if (connectionStatus !== SocketStatus.CONNECTED)
        throw new Error("Socket is not connected.");

      socket.on("disconnect", () => {
        set({ room: null });
      });

      socket.on("forceDisconnection", () => {
        socket.disconnect();
        set({ room: null });
      });
      socket.on("roomData", (room: Room) => {
        set({ room: room });
      });

      socket.on("roomError", (error: any) => {
        Alert.alert("Socket room subscription error", error.toString());
      });
    } catch (e: any) {
      Alert.alert("Room Error", e.toString());
    }
  },
  createRoom: (roomName) => {
    set({ roomLoading: true });
    try {
      if (roomName.length === 0) throw new Error("Room name is empty.");
      const { socket, connectionStatus } = useSocketStore.getState();
      const user = useAuthStore.getState().user;
      if (!user || !socket) throw new Error("User or socket are null.");
      if (connectionStatus !== SocketStatus.CONNECTED)
        throw new Error("Socket is not connected.");

      socket.emit("createRoom", { user, roomName });
    } catch (e: any) {
      Alert.alert("Create Room Error", e.toString());
    } finally {
      set({ roomLoading: false });
    }
  },
  joinRoom: (roomId) => {
    set({ roomLoading: true });
    try {
      if (roomId.length === 0) throw new Error("Room id is empty.");
      const user = useAuthStore.getState().user;
      const { socket, connectionStatus } = useSocketStore.getState();
      if (!socket || !user) throw new Error("User or socket are not set.");
      if (connectionStatus !== SocketStatus.CONNECTED)
        throw new Error("Socket is not connected.");

      socket.emit("joinRoom", { user, roomId });
    } catch (e: any) {
      Alert.alert("Join Room Error", e.toString());
    } finally {
      set({ roomLoading: false });
    }
  },
  leaveRoom: () => {
    try {
      const socket = useSocketStore.getState().socket;
      if (!socket) throw new Error("Socket is null.");

      socket.disconnect();
    } catch (e: any) {
      Alert.alert("Leave Room Error", e.toString());
    } finally {
      set({ room: null });
    }
  },
  removeFromRoom: (userId: string) => {
    try {
      if (userId.length === 0) throw new Error("User id is empty.");
      const socket = useSocketStore.getState().socket;
      const user = useAuthStore.getState().user;
      const room = useRoomStore.getState().room;
      if (!user || !socket || !room)
        throw new Error("User, socket, or room are not set.");
      if (room.hostId !== user.id) throw new Error("User is not the host.");

      socket.emit("removeFromRoom", { userId });
    } catch (e: any) {
      Alert.alert("Remove from room Error", e.toString());
    }
  },
}));
