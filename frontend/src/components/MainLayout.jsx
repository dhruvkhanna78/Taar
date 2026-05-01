import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import { useSelector } from "react-redux";
import socket from "../socket/socket"; // ✅ add this

const MainLayout = () => {
  const { user } = useSelector((store) => store.auth);

  // ✅ register user to socket server
  useEffect(() => {
    if (user?._id) {
      socket.emit("registerUser", user._id);
    }
  }, [user]);

  // ✅ listen for notifications
  useEffect(() => {
  // Check connection status
  socket.on("connect", () => {
    console.log("✅ Socket Connected! ID:", socket.id);
  });

  // Check if notification is received
  socket.on("notification", (data) => {
    console.log("🔔 New notification received:", data);
  });

  // Check for errors
  socket.on("connect_error", (err) => {
    console.log("❌ Connection Error:", err.message);
  });

  return () => {
    socket.off("connect");
    socket.off("notification");
    socket.off("connect_error");
  };
}, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden">
      {user && <LeftSidebar />}

      <div
        className={`flex-1 w-full min-w-0 ${
          user ? "md:ml-64 pb-24 md:pb-0" : ""
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;