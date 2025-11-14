import {io} from "socket.io-client";

export const socket = io("http://10.0.2.2:3000")
socket.on("connect", () => {
    console.log("Connected!", socket.id);
})
socket.on("disconnect", () => {
    console.log("Disconnected!", socket.id);
})