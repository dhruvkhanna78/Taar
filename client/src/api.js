// src/api.js
import axios from "axios";

// ✅ Update this IP to your current local IP
const API = axios.create({
  baseURL: "http://192.168.1.3:5000/api", // Apne PC ka local IP aur api prefix
  withCredentials: true,
});

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default API;

// ✅ Update this too
export const BASE_URL = "http://192.168.1.3:5000"; // For images or other URLs
