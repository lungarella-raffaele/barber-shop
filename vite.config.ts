import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    sveltekit(),
    mode === "analyze" &&
      visualizer({
        emitFile: true,
        filename: "bundle-report.html",
        template: "treemap",
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  resolve: process.env.VITEST
    ? {
        conditions: ["browser"],
      }
    : undefined,

  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["src/**/*.{test,spec}.{js,ts}"],
          clearMocks: true,
          restoreMocks: true,
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.{test,spec}.{js,ts}"],
          setupFiles: ["tests/support/integration.setup.ts"],
          testTimeout: 10_000,
        },
      },
    ],
  },
}));
