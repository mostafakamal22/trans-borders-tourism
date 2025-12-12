import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [svgr(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          react: ["react", "react-dom", "react-router-dom"],

          // Redux state
          redux: ["@reduxjs/toolkit", "react-redux"],

          // Animations
          motion: ["framer-motion"],

          // PDF & Export tools
          pdf: [
            "@react-pdf/renderer",
            "jspdf",
            "html2canvas",
            "jszip",
            "file-saver",
          ],

          // Charts
          charts: ["chart.js", "react-chartjs-2"],

          // Utilities
          utils: ["dayjs", "jwt-decode"],

          // UI extras
          ui: ["react-toastify", "react-icons", "react-spinners"],
        },
      },
    },
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         // Example: Split node_modules into a 'vendor' chunk
  //         if (id.includes("node_modules")) {
  //           return "vendor";
  //         }
  //       },
  //     },
  //   },
  // },
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
