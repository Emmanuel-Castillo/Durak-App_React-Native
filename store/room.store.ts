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
      // console.log("[subscribeToRoomEvents]: Invoked")
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("No user found.");

      const { socket, connectionStatus } = useSocketStore.getState();
      if (!socket) throw new Error("No socket found.");

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
        // console.log("[subscribeToRoomEvents]:", user.profile_id,"Connected to room", room.name)
        set({ room: room });
      });
      socket.on("roomError", (error: any) => {
        Alert.alert("Socket room subscription error", error.toString());
      });

      socket.emit("testGame", { user });
    } catch (e: any) {
      Alert.alert(e.toString());
    }
    // socket.emit("testGame", {user})     // TESTING
    // socket.on("gameData", (game: Game) => {
    //     const room = useRoomStore.getState().room;
    //     if (!room) return console.warn("No room found. Cannot update game data.");
    //
    //     // Sort players starting with own UserId
    //     game.players = sortPlayersStartingWithUser(user.account_id, game.players)
    //     set({room: {...room, game: game}});
    // })
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
      const { socket, connectionStatus } = useSocketStore.getState();
      const user = useAuthStore.getState().user;
      if (!socket || !user) throw new Error("User or socket are null.");
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
      if (userId.length === 0) throw new Error("UserId id is empty.");
      const socket = useSocketStore.getState().socket;
      const user = useAuthStore.getState().user;
      const room = useRoomStore.getState().room;
      if (!user || !socket || !room)
        throw new Error("User, socket, or room are null.");
      if (room.hostId !== user.account_id)
        throw new Error("User is not the host.");

      socket.emit("removeFromRoom", { userId });
    } catch (e: any) {
      Alert.alert("Remove from room Error", e.toString());
    }
  },
}));
