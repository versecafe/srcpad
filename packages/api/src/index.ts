import { Hono } from "hono";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import path from "path";
import fs from "fs";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { SRCPAD_DIR, SRCPADS_DIR, DRIZZLE_DIR, UI_DIR } from "./constants.ts";
import { users } from "./db/schema.ts";
import { createBunWebSocket } from "hono/bun";
import { $ } from "bun";
import { serveGlobalStatic } from "./global-static.ts";

fs.mkdirSync(SRCPADS_DIR, { recursive: true });

const sqlite = new Database(path.join(SRCPAD_DIR, "srcpad.db"));
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: DRIZZLE_DIR });

const { upgradeWebSocket, websocket } = createBunWebSocket();

export const app = new Hono();

app.get(
  "/",
  serveGlobalStatic({
    path: path.join(UI_DIR, "index.html"),
  }),
);

app.get(
  "/assets/*",
  serveGlobalStatic({
    root: path.join(UI_DIR),
  }),
);

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

type Message = {
  topic: string;
  event: string;
  payload: any;
};

app.get(
  "/ws",
  upgradeWebSocket(async (c) => {
    return {
      onOpen(_, ws) {
        ws.send(
          JSON.stringify({
            event: "server:connected",
            payload: { message: "hello from srcpad!" },
          }),
        );
      },
      async onMessage(event, ws) {
        const message: Message = JSON.parse(event.data as string);
        if (message.event === "cell:run") {
          try {
            const result = await $`echo ${message.payload.source} | bun run -`;
            ws.send(
              JSON.stringify({
                event: "cell:run:result",
                payload: {
                  stdout: result.stdout.toString(),
                  stderr: result.stderr.toString(),
                },
              }),
            );
          } catch (error) {
            ws.send(
              JSON.stringify({
                event: "cell:run:error",
                payload: error,
              }),
            );
          }
        }
      },
      onClose: () => {
        console.log("ws connection closed");
      },
    };
  }),
);

export function serve(port: number) {
  Bun.serve({ fetch: app.fetch, port: port, websocket: websocket });
}
