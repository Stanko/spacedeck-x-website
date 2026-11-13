import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "./",
  build: {
    outDir: "./docs",
    rolldownOptions: {
      input: [
        resolve(import.meta.dirname, "index.html"),
        resolve(import.meta.dirname, "privacy/index.html"),
      ],
    },
  },
  server: {
    port: 1234,
    host: true,
    allowedHosts: true,
  },
});
