import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@api": path.join(srcDir, "api"),
      "@components": path.join(srcDir, "components"),
      "@containers": path.join(srcDir, "containers"),
      "@domain": path.join(srcDir, "domain"),
      "@hooks": path.join(srcDir, "hooks"),
      "@pages": path.join(srcDir, "pages"),
      "@providers": path.join(srcDir, "providers"),
      "@services": path.join(srcDir, "services"),
      "@types": path.join(srcDir, "types"),
      "@utils": path.join(srcDir, "utils"),
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
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/api/**/*.{ts,tsx}",
        "src/components/**/*.{ts,tsx}",
        "src/containers/**/*.{ts,tsx}",
        "src/hooks/**/*.{ts,tsx}",
        "src/pages/**/*.{ts,tsx}",
        "src/utils/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.types.ts",
        "**/index.ts",
        "**/__stories__/**",
        "**/__tests__/**",
      ],
      thresholds: {
        branches: 80,
        lines: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
});
