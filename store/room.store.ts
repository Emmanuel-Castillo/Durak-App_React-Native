import {create} from 'zustand'
import {Game, Room} from "@/type";
import {Socket, io} from "socket.io-client"
import {useAuthStore} from "@/store/auth.store";
import {sortPlayersStartingWithUser} from "@/lib/sortPlayers";

type RoomState = {
    socket: Socket | null;
    room: Room | null;

    connectSocket: () => void;
    createRoom: (roomName: string) => void;
    joinRoom: (roomId: string) => void;
    leaveRoom: () => void;
    removeFromRoom: (playerId: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    socket: null,
    room: null,
    connectSocket: () => {
        const user = useAuthStore.getState().user;
        if (!user) return console.warn("No user found. Cannot connect socket.");

        const socket = io("http://10.0.2.2:3000")
        set({socket});
        socket.on("connect", () => {
            console.log("Connected!", socket.id);
            set({room: null})
        })
        socket.on("disconnect", () => {
            set({socket: null, room: null});
        })
        socket.on("forceDisconnection", () => {
            socket.disconnect()
            set({socket: null, room: null});
        })
        socket.on("roomData", (room: Room) => {
            set({room: room});
        })
        socket.on("gameData", (game: Game) => {
            const room = useRoomStore.getState().room;
            if (!room) return console.warn("No room found. Cannot update game data.");

            // Sort players starting with own User
            game.players = sortPlayersStartingWithUser(user.account_id, game.players)
            set({room: {...room, game: game}});
        })
    },
    createRoom: (roomName) => {
        const socket = useRoomStore.getState().socket;
        const user = useAuthStore.getState().user;
        if (!socket || !user) return console.warn("Socket or user undefined.");
        socket.emit("createRoom", {user, roomName});
    },
    joinRoom: (roomId) => {
        const socket = useRoomStore.getState().socket;
        const user = useAuthStore.getState().user;
        if (!socket || !user) return console.warn("Socket or user undefined.");
        socket.emit("joinRoom", {user, roomId});
    },
    leaveRoom: () => {
        const socket = useRoomStore.getState().socket;
        if (!socket) return console.warn("Socket undefined.");
        socket.disconnect();
        set({socket: null, room: null});
    },
    removeFromRoom: (playerId: string) => {
        const socket = useRoomStore.getState().socket;
        const room = useRoomStore.getState().room;
        const user = useAuthStore.getState().user;
        if (!user || !socket || !room) return console.warn("User, socket, or room undefined.");

        if (room.hostId !== user.account_id) return console.warn("User is not the host. RemoveFromRoom permission invalid.");
        socket.emit("removeFromRoom", {playerId})
    }
}))
