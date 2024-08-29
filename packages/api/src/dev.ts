import { app } from "./index.ts";

Bun.serve({
  port: 2150,
  fetch: app.fetch,
});
