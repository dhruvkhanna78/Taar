import { Server } from "socket.io";

let io;
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://taar-szo1.onrender.com",
       // 👈 Aapka frontend URL exact hona chahiye
        methods: ["GET", "POST"],
        credentials: true
    },
  });

  io.on("connection", (socket) => {
    socket.on("registerUser", (userId) => {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
        }
      }
    });
  });
};

export const getIO = () => io;

export const getReceiverSocket = (userId) => {
  return onlineUsers.get(userId);
};
