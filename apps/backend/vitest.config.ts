import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.d.ts",
        "src/server.ts",
        "src/config/**",
        "src/**/routes/**",
        "src/**/*.types.ts"
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 55,
        statements: 60
      }
    }
  }
});
