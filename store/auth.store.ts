import {create} from 'zustand'
import {FriendRequest, User} from "@/type";
import {
    getSessionUserProfile,
    getFriendProfileIds,
    sendFriendRequest,
    approveFriendRequest,
    deleteFriendRequest, removeFriendship, getSentRequests, getReceivedRequests, getFriendProfiles
} from "@/utils/supabase";
import {Alert} from "react-native";
import {io, Socket} from "socket.io-client";

type AuthState = {
    isAnonymous: boolean,
    isAuthenticated: boolean;
    user: User | null;
    socket: Socket | null;
    friends: User[];
    sentFriendRequests: FriendRequest[];
    receivedFriendRequests: FriendRequest[];
    isLoading: boolean;

    connectSocket: () => void;
    setIsAuthenticated: (value: boolean) => void;
    setUser: (value: User | null) => void;
    setIsLoading: (value: boolean) => void;

    fetchAuthenticatedUser: () => Promise<void>;
    resetAuthenticatedUser: () => void;

    fetchFriendsAndRequests: () => void;
    sendFriendRequest: (friend: User) => void;
    approveFriendRequest: (request: FriendRequest) => void;
    rejectFriendRequest: (request: FriendRequest) => void;
    removeFriendship: (friend: User) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isAnonymous: false,
    user: null,
    socket: null,
    friends: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    isLoading: true,

    connectSocket: () => {
        try {
            const user = useAuthStore.getState().user;
            if (!user) throw new Error("No user found. Cannot connect socket.");

            const socket = io(process.env.EXPO_PUBLIC_SERVER_URL, {
                transports: ["websocket"]
            });

            socket.on("connect", () => {
                console.log("Connected!", socket.id);
            })
            socket.on("disconnect", () => {
                console.log("Disconnected!", socket.id);
            })

            set({socket});
        } catch (e: any) {
            Alert.alert(e.toString());
        }
    },
    setIsAuthenticated: (value) => set({isAuthenticated: value}),
    setUser: (user) => set({user: user}),
    setIsLoading: (value) => set({isLoading: value}),

    fetchAuthenticatedUser: async () => {
        set({isLoading: true});
        try {
            const {isAnon, user} = await getSessionUserProfile();



            set({isAuthenticated: true, user, isAnonymous: isAnon});
        } catch (e: any) {
            // console.error("fetchAuthenticatedUser", e);
            set({isAuthenticated: false, user: null});
        } finally {
            set({isLoading: false});
        }
    },
    resetAuthenticatedUser: () => {
        set({user: null, isAuthenticated: false})
    },

    fetchFriendsAndRequests: async () => {
        try {
            const user = useAuthStore.getState().user
            if (!user) throw new Error("User is not defined.")
            const friendIds: number[] = await getFriendProfileIds(user)
            const friends: User[] = await getFriendProfiles(friendIds)
            const sentFriendRequests = await getSentRequests(user)
            const receivedFriendRequests = await getReceivedRequests(user)
            set({friends, sentFriendRequests, receivedFriendRequests})
        } catch (e: any) {
            set({friends: [], sentFriendRequests: [], receivedFriendRequests: []})
        }
    },
    sendFriendRequest: async (friend: User) => {
        try {
            const user = useAuthStore.getState().user;
            const friendRequests = useAuthStore.getState().sentFriendRequests;
            if (!user) throw new Error("User not found");
            const data = await sendFriendRequest(user, friend)

            set({sentFriendRequests: friendRequests.concat(data)})
            // socket emit request to server
        } catch (e: any) {
            Alert.alert(e.toString());
        }
    },
    approveFriendRequest: async (request: FriendRequest) => {
        try {
            const requests = useAuthStore.getState().receivedFriendRequests
            const friends = useAuthStore.getState().friends
            await approveFriendRequest(request)

            set({
                friends: friends.concat(request.sender),
                receivedFriendRequests: requests.filter(r => r.id !== request.id)
            })
        } catch (e: any) {
            Alert.alert(e.toString());
        }
    },
    rejectFriendRequest: async (request: FriendRequest) => {
        try {
            const requests = useAuthStore.getState().receivedFriendRequests
            await deleteFriendRequest(request)

            set({receivedFriendRequests: requests.filter(r => r.id !== request.id)})
        } catch (e: any) {
            Alert.alert(e.toString());
        }
    },
    removeFriendship: async (friend: User) => {
        try {
            const user = useAuthStore.getState().user
            if (!user) throw new Error("User not found.")
            await removeFriendship(user, friend)

            const friends = useAuthStore.getState().friends;
            set({friends: friends.filter(f => f.id !== friend.id)})
        } catch (e: any) {
            Alert.alert(e.toString())
        }
    },
}))
