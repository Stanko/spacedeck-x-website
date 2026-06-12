import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "./",
  build: {
    outDir: "./docs",
  },
  server: {
    port: 1234,
    host: true,
    allowedHosts: true,
  },
});
