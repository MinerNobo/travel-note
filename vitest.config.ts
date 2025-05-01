import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
      ],
    },
    server: {
      deps: {
        inline: [
          /@tarojs\/runtime/,
          /@tarojs\/taro/,
          /@tarojs\/components/,
          /@tarojs\/helper/,
          /@tarojs\/shared/,
        ],
      },
    },
  },
});
