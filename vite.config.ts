import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      __VITE_BACKEND_URL__: JSON.stringify(env.VITE_BACKEND_URL ?? ""),
    },
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8082",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
