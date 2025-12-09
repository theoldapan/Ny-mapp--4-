import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      pfx: fs.readFileSync("C:/Users/M/Desktop/localhost.pfx"),
      passphrase: "password",
    },
    host: "localhost",
    port: 5173,

    hmr: {
      protocol: "wss",
      host: "localhost",
      port: 5173,
    },

    cors: {
      origin: ["https://localhost:7015", "https://localhost:5173"],
      credentials: true,
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
