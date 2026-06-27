import { FriendRequest, User } from "@/type";
import {
  approveFriendRequest,
  deleteFriendRequest,
  getFriendProfileIds,
  getFriendProfiles,
  getReceivedRequests,
  getSentRequests,
  getSessionUserProfile,
  removeFriendship,
  sendFriendRequest,
} from "@/utils/supabase";
import { Alert } from "react-native";
import { create } from "zustand";

type AuthState = {
  isAnonymous: boolean;
  isAuthenticated: boolean;
  user: User | null;
  friends: User[];

  loadingFriendsAndRequests: boolean;
  sentFriendRequests: FriendRequest[];
  receivedFriendRequests: FriendRequest[];
  isLoading: boolean;
  socketTimeout: boolean;

  fetchGuestUser: () => void;
  fetchAuthenticatedUser: () => Promise<void>;
  resetAuthenticatedUser: () => void;

  fetchFriendsAndRequests: () => void;
  sendFriendRequest: (friend: User) => void;
  approveFriendRequest: (request: FriendRequest) => void;
  rejectFriendRequest: (request: FriendRequest) => void;
  removeFriendship: (friend: User) => void;
};
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isAnonymous: false,
  user: null,
  friends: [],
  sentFriendRequests: [],
  receivedFriendRequests: [],
  isLoading: true,
  loadingFriendsAndRequests: false,
  socketTimeout: false,
  fetchGuestUser: async () => {
    const newUser: User = {
      id: 0,
      created_at: new Date(),
      username: "Guest",
      email: "",
      num_wins: 0,
      account_id: "",
      profile_id: "",
    };
    set({ user: newUser, isAuthenticated: true, isAnonymous: true });
  },
  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const { isAnon, user } = await getSessionUserProfile();
      set({ isAuthenticated: true, user, isAnonymous: isAnon });

      if (!isAnon) useAuthStore.getState().fetchFriendsAndRequests();
    } catch (e: any) {
      // console.log("[fetchAuthenticatedUser]", e);
    } finally {
      set({ isLoading: false });
    }
  },
  resetAuthenticatedUser: () => {
    set({
      user: null,
      isAnonymous: false,
      isAuthenticated: false,
      friends: [],
      sentFriendRequests: [],
      receivedFriendRequests: [],
    });
  },

  fetchFriendsAndRequests: async () => {
    set({ loadingFriendsAndRequests: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("User is not defined.");

      const friendIds: number[] = await getFriendProfileIds(user);
      const friends: User[] = await getFriendProfiles(friendIds);
      const sentFriendRequests = await getSentRequests(user);
      const receivedFriendRequests = await getReceivedRequests(user);
      set({ friends, sentFriendRequests, receivedFriendRequests });
    } catch (e: any) {
      set({ friends: [], sentFriendRequests: [], receivedFriendRequests: [] });
    } finally {
      set({ loadingFriendsAndRequests: false });
    }
  },
  sendFriendRequest: async (friend: User) => {
    try {
      const user = useAuthStore.getState().user;
      const friendRequests = useAuthStore.getState().sentFriendRequests;
      if (!user) throw new Error("User not found");
      const sentRequest = await sendFriendRequest(user, friend);

      set({ sentFriendRequests: friendRequests.concat(sentRequest) });
      // socket emit request to server
    } catch (e: any) {
      Alert.alert(e.toString());
    }
  },
  approveFriendRequest: async (request: FriendRequest) => {
    try {
      const requests = useAuthStore.getState().receivedFriendRequests;
      const friends = useAuthStore.getState().friends;
      await approveFriendRequest(request);

      set({
        friends: friends.concat(request.sender),
        receivedFriendRequests: requests.filter((r) => r.id !== request.id),
      });
    } catch (e: any) {
      Alert.alert(e.toString());
    }
  },
  rejectFriendRequest: async (request: FriendRequest) => {
    try {
      const requests = useAuthStore.getState().receivedFriendRequests;
      await deleteFriendRequest(request);

      set({
        receivedFriendRequests: requests.filter((r) => r.id !== request.id),
      });
    } catch (e: any) {
      Alert.alert(e.toString());
    }
  },
  removeFriendship: async (friend: User) => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("User not found.");
      await removeFriendship(user, friend);

      const friends = useAuthStore.getState().friends;
      set({ friends: friends.filter((f) => f.id !== friend.id) });
    } catch (e: any) {
      Alert.alert(e.toString());
    }
  },
}));
