import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const backendDir = path.resolve(__dirname, "../backend");
const dbPath = path.join(backendDir, "e2e-test.db");
const pythonBin = path.join(backendDir, ".venv/bin/python");
const seedScript = path.resolve(__dirname, "seed-e2e.py");

export default function globalSetup() {
  // Remove old database if it exists
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  // Create tables and seed users
  execSync(`${pythonBin} ${seedScript}`, {
    cwd: backendDir,
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: `sqlite:///${dbPath}`,
      PYTHONPATH: backendDir,
    },
  });
}
