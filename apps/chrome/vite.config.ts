import path from "node:path";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import zip from "vite-plugin-zip-pack";
import manifest from "./manifest.config.js";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
    crx({ manifest }),
    zip({ outDir: "release", outFileName: `release.zip` }),
  ],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
});
