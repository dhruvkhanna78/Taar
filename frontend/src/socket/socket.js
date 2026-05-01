import { io } from "socket.io-client";

const socket = io("https://taar-server.onrender.com", {
    transports: ["websocket"], // 👈 Ye polling ko bypass karke direct websocket use karega
    upgrade: false
});

export default socket;