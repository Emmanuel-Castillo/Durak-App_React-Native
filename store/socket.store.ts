import { Alert } from "react-native";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";

export enum SocketStatus {
  CONNECTED,
  DISCONNECTED,
  CONNECTION_TIMEOUT,
}

type SocketState = {
  socket: Socket | null;
  connectionStatus: SocketStatus;
  connectSocket: () => void;
};
export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  connectionStatus: SocketStatus.DISCONNECTED,
  connectSocket: () => {
    try {
      // console.log("[connectSocket]: Invoked. Connecting to", process.env.EXPO_PUBLIC_SERVER_URL);
      const socket = io(process.env.EXPO_PUBLIC_SERVER_URL, {
        transports: ["websocket"],
        timeout: 5000,
      });

      socket.on("connect_error", () => {
        // console.log("[connectSocket]: Connection Error " + new Date().toISOString());
        if (
          useSocketStore.getState().connectionStatus !==
          SocketStatus.CONNECTION_TIMEOUT
        ) {
          Alert.alert(
            "Connection Error",
            "Socket cannot connect to server. Restart app or try again later.",
          );
          set({ connectionStatus: SocketStatus.CONNECTION_TIMEOUT });
        }
      });

      socket.on("connect", () => {
        console.log("[connectSocket]: Connected!", socket.id);
        set({ connectionStatus: SocketStatus.CONNECTED });
      });
      socket.on("disconnect", () => {
        console.log("[connectSocket]: Disconnected!", socket.id);
        set({ socket: null, connectionStatus: SocketStatus.DISCONNECTED });
      });

      set({ socket });
    } catch (e: any) {
      Alert.alert(e.toString());
    }
  },
}));
