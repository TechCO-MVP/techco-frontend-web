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
        // Temp exlucude for WIP components
        "app/[lang]/[company_name]/[vacancy_name]/details/page.tsx",
        "app/api/*",
        "hooks/*",
        "actions/pipefy/update-field.ts",
        "components/TopBar/*",
        "components/UserMenu/*",
        "components/UserInfo/*",
        "components/Openings/*",
        "components/OpeningTracking/*",
        "components/Board/*",
        "components/BoardColumn/*",
        "components/Board/UserCard*",
        "components/CancelApplicationDialog/*",
        "components/CandidateDetailsDialog/*",
        "components/CreateUserDialog/*",
        "components/WalkthroughDialog/*",
        "components/UserSettingsTab/*",
        "components/StartFormDialog/*",
        "components/SendApplicationDialog/*",
        "components/CommentBox/*",
        "components/EditableField/*",
        "components/Notifications/*",
        "components/UserCard/*",
        "components/PhaseHistory/*",
        "icons/*",
        "lib/utils.ts",
        "lib/api-endpoints.ts",
        "types/*",
        "lib/pipefy/*",
        "lib/graphql/*",
        // End Temp exlucude for WIP components
        ".storybook",
        ".next",
        "*.d.ts",
        "*.config.{ts,js,mts,mjs}",
        "lib/theme/index.ts",
      ],
    },
  },
});
