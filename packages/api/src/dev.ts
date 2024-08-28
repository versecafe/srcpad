import { app } from ".";

Bun.serve({
  port: 3000,
  fetch: app.fetch,
});
