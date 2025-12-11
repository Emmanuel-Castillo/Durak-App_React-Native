import {create} from 'zustand'
import {User} from "@/type";
import {getCurrentUser, getCurrentUserFriendIds} from "@/utils/supabase";
import {Socket} from "socket.io-client";

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    friendIds: number[];
    isLoading: boolean;

    setIsAuthenticated: (value: boolean) => void;
    setUser: (value: User | null) => void;
    setIsLoading: (value: boolean) => void;

    fetchAuthenticatedUser: () => Promise<void>;
    resetAuthenticatedUser: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    friendIds: [],
    isLoading: true,

    setIsAuthenticated: (value) => set({isAuthenticated: value}),
    setUser: (user) => set({user: user}),
    setIsLoading: (value) => set({isLoading: value}),

    fetchAuthenticatedUser: async () => {
        set({isLoading: true});
        try {
            const user: User = await getCurrentUser();
            const friendIds: number[] = await getCurrentUserFriendIds(user.id)

            set({isAuthenticated: true, user, friendIds});
        } catch (e) {
            // console.error("fetchAuthenticatedUser", e);
            set({isAuthenticated: false, user: null})
        } finally {
            set({isLoading: false});
        }
    },
    resetAuthenticatedUser: () => {
        set({user: null, isAuthenticated: false})
    }
}))
