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
  loadingConnection: boolean;
  connectionStatus: SocketStatus;
  connectSocket: () => void;
};
export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  loadingConnection: false,
  connectionStatus: SocketStatus.DISCONNECTED,
  connectSocket: () => {
    try {
      set({ loadingConnection: true });
      const socket = io(process.env.EXPO_PUBLIC_SERVER_URL, {
        transports: ["websocket"],
        timeout: 5000,
      });

      socket.on("connect_error", () => {
        if (
          useSocketStore.getState().connectionStatus !==
          SocketStatus.CONNECTION_TIMEOUT
        ) {
          Alert.alert(
            "Connection Error",
            "Socket cannot connect to server. Restart app or try again later.",
          );
          set({
            connectionStatus: SocketStatus.CONNECTION_TIMEOUT,
            loadingConnection: false,
          });
        }
      });

      socket.on("connect", () => {
        set({
          connectionStatus: SocketStatus.CONNECTED,
          loadingConnection: false,
        });
      });

      socket.on("disconnect", () => {
        set({ socket: null, connectionStatus: SocketStatus.DISCONNECTED });
      });

      set({ socket });
    } catch (e: any) {
      Alert.alert("Socket Error", e.toString());
    }
  },
}));
