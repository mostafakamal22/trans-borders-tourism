import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
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
});
