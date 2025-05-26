import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { copyFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      allow: ["."],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  // 🔥 This ensures _redirects gets copied into /dist for Render
  buildEnd() {
    try {
      copyFileSync("public/_redirects", "dist/_redirects");
      console.log("✅ _redirects copied to /dist");
    } catch (err) {
      console.warn("⚠️ Could not copy _redirects:", err);
    }
  },
});
