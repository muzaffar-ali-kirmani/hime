import { defineConfig } from "drizzle-kit";
import { readFileSync } from "fs";

// drizzle-kit does not auto-load .env — parse it here
let url = process.env.DATABASE_URL ?? "";
if (!url) {
  try {
    for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/);
      if (m) url = m[1].replace(/^["']|["']$/g, "");
    }
  } catch {
    // no .env file
  }
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
});
