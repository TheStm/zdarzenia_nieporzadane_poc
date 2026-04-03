import { defineConfig } from "@playwright/test";
import path from "path";

const backendDir = path.resolve(__dirname, "../backend");
const frontendDir = path.resolve(__dirname, "../frontend");

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./global-setup.ts",
  globalTeardown: "./global-teardown.ts",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: [
    {
      command: `DATABASE_URL=sqlite:///${backendDir}/e2e-test.db ${backendDir}/.venv/bin/python -m uvicorn app.main:app --port 8000`,
      cwd: backendDir,
      port: 8000,
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
    },
    {
      command: "npm run dev",
      cwd: frontendDir,
      port: 5173,
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
      env: {
        VITE_API_TARGET: "http://localhost:8000",
      },
    },
  ],
});
