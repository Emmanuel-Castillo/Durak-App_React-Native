import {create} from 'zustand'
import {Room} from "@/type";
import {Socket, io} from "socket.io-client"
import {useAuthStore} from "@/store/auth.store";

type PlayerState = {
    socket: Socket | null;
    room: Room | null;

    connectSocket: () => void;
    createRoom: (roomName: string) => void;
    joinRoom: (roomId: string) => void;
    leaveRoom: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    socket: null,
    room: null,
    connectSocket: () => {
        const user = useAuthStore.getState().user;
        if (!user) return console.warn("No user found. Cannot connect socket.");

        const socket = io("http://10.0.2.2:3000")
        set({socket});
        socket.on("connect", () => {
            console.log("Connected!", socket.id);
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
    },
    createRoom: (roomName) => {
        const socket = usePlayerStore.getState().socket;
        const user = useAuthStore.getState().user;
        if (!socket || !user) return console.warn("Socket or user undefined.");
        socket.emit("createRoom", {player: user, roomName});
    },
    joinRoom: (roomId) => {
        const socket = usePlayerStore.getState().socket;
        const user = useAuthStore.getState().user;
        if (!socket || !user) return console.warn("Socket or user undefined.");
        socket.emit("joinRoom", {player: user, roomId});
    },
    leaveRoom: () => {
        const socket = usePlayerStore.getState().socket;
        if (!socket) return console.warn("Socket undefined.");
        socket.disconnect();
        set({socket: null, room: null});
    }
}))
