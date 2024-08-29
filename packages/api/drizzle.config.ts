import { defineConfig } from "drizzle-kit";
import { SRCPAD_DIR } from "./src/constants.ts";
import Path from "path";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: Path.join(SRCPAD_DIR, "srcbook.db"),
  },
});
