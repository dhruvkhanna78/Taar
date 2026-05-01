import { io } from "socket.io-client";

const socket = io("https://taar-server.onrender.com");

export default socket;