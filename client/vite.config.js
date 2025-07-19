import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // network par accessible banata hai
    port: 5173,
    proxy: {
      "/api": {
        target: "http://192.168.1.3:5000", // flask backend ka IP
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
