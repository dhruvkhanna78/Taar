// src/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Whenever profilePic changes, sync it with localStorage
  useEffect(() => {
    if (profilePic) localStorage.setItem("profilePic", profilePic);
  }, [profilePic]);

  // Similarly sync token and userId if you want

  return (
    <UserContext.Provider value={{ profilePic, setProfilePic, userId, setUserId, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
