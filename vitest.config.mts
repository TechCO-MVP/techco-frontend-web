import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    setupFiles: ["vitest.setup.ts"],
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "json-summary"],
      reportsDirectory: "coverage",
      exclude: [
        "**/*.stories.{ts,tsx}",
        "components/ui/**",
        ".storybook",
        ".next",
        "*.d.ts",
        "*.config.{ts,js,mts,mjs}",
        "lib/theme/index.ts",
      ],
    },
  },
});
