import { User } from "@/types";
import { Socket } from "socket.io-client";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  socket: Socket | null;
  socketTimeout: boolean;

  setUser: (user: User) => void;
};
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  socket: null,
  socketTimeout: false,
  setUser: (user: User | null) => {
    set({ user: user });
  },
}));
