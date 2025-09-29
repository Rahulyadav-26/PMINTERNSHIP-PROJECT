import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,           // allow external access
    port: 8080,           // your dev server port
    allowedHosts: ['*'],  // allow all tunnels: Cloudflare, Ngrok, LocalTunnel
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(), // development-only plugin
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // use @ for src imports
    },
  },
}));
