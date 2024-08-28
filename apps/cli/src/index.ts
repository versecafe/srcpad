import { number } from "@drizzle-team/brocli";
import { run, command, positional } from "@drizzle-team/brocli";
import { app } from "@repo/api/core";

const echo = command({
  name: "echo",
  desc: "echoes the given text",
  options: {
    text: positional().desc("Text to echo").default("echo"),
  },
  handler: (opts) => {
    console.log(opts.text);
  },
});

const start = command({
  name: "start",
  desc: "starts the srcpad server and UI",
  options: {
    port: number()
      .alias("p")
      .desc("port to start server on")
      .default(2150)
      .min(0)
      .max(65535),
  },
  handler: (opts) => {
    console.log(`starting server on port ${opts.port}`);
    Bun.serve({ fetch: app.fetch, port: opts.port });
  },
});

export function cli() {
  run([echo, start], { version: "0.1.0" });
}
