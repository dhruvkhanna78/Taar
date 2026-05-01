import { Server } from "socket.io";

let io;
// 1. Ek hi variable name use karo, Map acchi choice hai
const onlineUsers = new Map(); 

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://taar-szo1.onrender.com",
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    socket.on("registerUser", (userId) => {
      // 2. userSocketMap ki jagah onlineUsers.set use karo
      if (userId) {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      // 3. Map se delete karne ka sahi tareeka
      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
          console.log(`User ${key} disconnected`);
          break;
        }
      }
    });
  });
};

export const getIO = () => io;

export const getReceiverSocket = (userId) => {
  // 4. Map se value get karo
  return onlineUsers.get(userId);
};