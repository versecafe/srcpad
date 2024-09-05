import { number } from "@drizzle-team/brocli";
import { run, command, positional } from "@drizzle-team/brocli";
import { serve } from "@srcpad/api/core";
import { $ } from "bun";
import fs from "fs";

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
    serve(opts.port);
  },
});

const wasm = command({
  name: "wasm",
  desc: "runs all wasm extensions in parallel",
  handler: async () => {
    const extensionsDir = "../../extensions";
    const extensions = fs.readdirSync(extensionsDir);
    let extensionFiles: string[] = [];
    for (const extension of extensions) {
      const wasmFile = `${extensionsDir}/${extension}/zig-out/bin/${extension}.wasm`;
      if (fs.existsSync(wasmFile)) {
        extensionFiles.push(wasmFile);
      } else {
        console.log(`Skipping ${extension}`);
      }
    }
    Promise.all([...extensionFiles.map((file) => $`bun ${file}`)]);
  },
});

export function cli() {
  run([echo, start, wasm], { version: "0.1.0" });
}
