import {create} from 'zustand'
import {Game, Room} from "@/type";
import {Socket, io} from "socket.io-client"
import {useAuthStore} from "@/store/auth.store";
import {sortPlayersStartingWithUser} from "@/lib/sortPlayers";
import {useGameStore} from "@/store/game.store";
import {environment} from "expo-server";
import {Alert} from "react-native";

type RoomState = {
    room: Room | null;
    roomLoading: boolean;

    subscribeToRoomEvents: () => void;
    createRoom: (roomName: string) => void;
    joinRoom: (roomId: string) => void;
    leaveRoom: () => void;
    removeFromRoom: (playerId: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    room: null,
    roomLoading: false,
    subscribeToRoomEvents: () => {
        try {
            const user = useAuthStore.getState().user;
            if (!user) throw new Error("No user found.");

            const socket = useAuthStore.getState().socket;
            if (!socket) throw new Error("No socket found.");

            socket.on("disconnect", () => {
                set({room: null});
            })
            socket.on("forceDisconnection", () => {
                socket.disconnect()
                set({room: null});
            })
            socket.on("roomData", (room: Room) => {
                console.log("Connected to room", room.name)
                set({room: room});
            })
            socket.on("roomError", (error: any) => {
                Alert.alert(error.toString())
            })

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
        set({roomLoading: true})
        try {
            const socket = useAuthStore.getState().socket;
            const user = useAuthStore.getState().user;
            if (!socket || !user) throw new Error("Socket or user undefined.");
            if (roomName.length === 0) throw new Error("Room name is empty.");
            socket.emit("createRoom", {user, roomName});
        } catch (e: any) {
            Alert.alert(e.toString());
        } finally {
            set({roomLoading: false})
        }

    },
    joinRoom: (roomId) => {
        set({roomLoading: true})
        try {
            const socket = useAuthStore.getState().socket;
            const user = useAuthStore.getState().user;
            if (!socket || !user) throw new Error("Socket or user undefined.");
            if (roomId.length === 0) throw new Error("Room id is empty.");
            socket.emit("joinRoom", {user, roomId});
        } catch (e: any) {
            Alert.alert(e.toString());
        } finally {
            set({roomLoading: false})
        }
    },
    leaveRoom: () => {
        try {
            const socket = useAuthStore.getState().socket;
            if (!socket) throw new Error("Socket undefined.");
            socket.disconnect();
        } catch (e: any) {
            Alert.alert(e.toString());
        } finally {
            set({room: null});
        }
    },
    removeFromRoom: (userId: string) => {
        try {
            const socket = useAuthStore.getState().socket;
            const user = useAuthStore.getState().user;
            const room = useRoomStore.getState().room;
            if (!user || !socket || !room) throw new Error("UserId, socket, or room undefined.");
            if (userId.length === 0) throw new Error("UserId id is empty.");
            if (room.hostId !== user.account_id) throw new Error("UserId is not authorized to cannot remove users from room.");

            socket.emit("removeFromRoom", {userId})
        } catch (e: any) {
            Alert.alert(e.toString());
        }
    }
}))
