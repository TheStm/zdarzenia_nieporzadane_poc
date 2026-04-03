import fs from "fs";
import path from "path";

const dbPath = path.resolve(__dirname, "../backend/e2e-test.db");

export default function globalTeardown() {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
}
