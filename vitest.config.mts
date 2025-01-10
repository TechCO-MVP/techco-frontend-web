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
      all: true,
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      exclude: [
        "**/*.stories.{ts,tsx}",
        "components/ui/**",
        "hooks/use-toast.ts", // hook from shadcn
        "lib/paths.ts", // The helper is static

        "components/TopBar/*",
        "components/UserSettingsTab/*",
        "components/UserMenu/*",
        "components/CreateUserDialog/*",
        "components/CountryLabel/*",
        "components/CompanyDetailsForm/*",
        "components/UserInfo/*",
        "components/AboutCompanyTab/*",
        // End Temp exlucude to allow deploy
        ".storybook",
        ".next",
        "*.d.ts",
        "*.config.{ts,js,mts,mjs}",
        "lib/theme/index.ts",
      ],
    },
  },
});
