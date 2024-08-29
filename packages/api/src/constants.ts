import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const _filename = fileURLToPath(import.meta.url);

export const DIST_DIR = path.dirname(path.dirname(_filename));
export const DRIZZLE_DIR = path.join(DIST_DIR, "drizzle");
export const SRCPAD_DIR = path.join(os.homedir(), ".srcpad");
export const SRCPADS_DIR = path.join(SRCPAD_DIR, "srcpads");
