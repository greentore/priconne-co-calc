import { defineConfig } from "npm:vite@^4.4.9";

export default defineConfig({
  base: "./",
  build: {
    target: "esnext",
    emptyOutDir: true,
    minify: false,
    modulePreload: false,
    assetsInlineLimit: 0,
  },
});
