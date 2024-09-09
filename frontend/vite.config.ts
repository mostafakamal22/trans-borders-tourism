import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [svgr(), react(), splitVendorChunkPlugin()],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id: string) {
  //         // creating a chunk to @open-ish deps. Reducing the vendor chunk size
  //         if (id.includes("@open-ish") || id.includes("tslib")) {
  //           return "@open-ish";
  //         }
  //         // creating a chunk to react routes deps. Reducing the vendor chunk size
  //         if (
  //           id.includes("react-router-dom") ||
  //           id.includes("@remix-run") ||
  //           id.includes("react-router")
  //         ) {
  //           return "@react-router";
  //         }
  //       },
  //     },
  //   },
  // },
});
