import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import dts from 'vite-plugin-dts';
import path from "path";

import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/export.tsx"),
      name: "react-chatbotify",
      fileName: "react-chatbotify"
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React"
        },
        assetFileNames: (assetInfo) => {
            if (assetInfo.name === "style.css") return "react-chatbotify.css";
            return assetInfo.name;
        },
      }
    },
    outDir: "../dist",
  },
  assetsInclude: ["**/*.svg", "**/*.png", "**/*.wav"],
  plugins: [
    svgr({
        svgrOptions: {
            ref: true,
        },
    }),
    react({
      include: "**/*.{jsx,tsx}",
    }),
    dts()
  ],
  server: {
    port: 3000,
    host: true
  },
//   resolve: {
//     alias: {
//       src: path.resolve(__dirname, "src"),
//     }
//   },
});