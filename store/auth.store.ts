import { User } from "@/types";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
};
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user: User | null) => {
    set({ user: user });
  },
}));
