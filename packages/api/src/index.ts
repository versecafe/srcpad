import { Hono } from "hono";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import path from "path";
import fs from "fs";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { SRCPAD_DIR, SRCPADS_DIR, DRIZZLE_DIR } from "./constants.ts";
import { users } from "./db/schema.ts";

fs.mkdirSync(SRCPADS_DIR, { recursive: true });

const sqlite = new Database(path.join(SRCPAD_DIR, "srcpad.db"));
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: DRIZZLE_DIR });

export const app = new Hono();

app.get("/", async (c) => {
  return c.text("Hello Hono!");
});

app.post("/users", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.user_id) throw new Error("user_id is required");
    await db.insert(users).values({ id: body.user_id });
    return c.json({ success: true });
  } catch (e) {
    return c.json({ success: false, error: e });
  }
});

app.get("/users", async (c) => {
  const result = await db.select().from(users);
  return c.json(result);
});
