import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@api": path.join(srcDir, "api"),
      "@components": path.join(srcDir, "components"),
      "@domain": path.join(srcDir, "domain"),
      "@features": path.join(srcDir, "features"),
      "@hooks": path.join(srcDir, "hooks"),
      "@lib": path.join(srcDir, "lib"),
      "@pages": path.join(srcDir, "pages"),
      "@services": path.join(srcDir, "services"),
      "@state": path.join(srcDir, "state"),
      "@types": path.join(srcDir, "types"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "favicon.svg",
        "favicon-32.png",
        "apple-touch-icon.png",
        "pwa-icon.svg",
      ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: "index.html",
      },
      manifest: {
        id: "/",
        scope: "/",
        name: "Архив погоды",
        short_name: "Архив погоды",
        description: "Просмотр архива погоды по Open-Meteo",
        lang: "ru",
        theme_color: "#1677ff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "any",
        start_url: "/",
        categories: ["weather"],
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
