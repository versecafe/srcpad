import { serveStatic as baseServeStatic } from "hono/serve-static";
import type { ServeStaticOptions } from "hono/serve-static";
import type { Env, MiddlewareHandler } from "hono/types";
import { stat } from "node:fs/promises";

/** A custom serveStatic impl based on OS root file paths */
export const serveGlobalStatic = <E extends Env = Env>(
  options: ServeStaticOptions<E>,
): MiddlewareHandler => {
  return async function serveStatic(c, next) {
    const getContent = async (path: string) => {
      path = `/${path}`;
      const file = Bun.file(path);
      return (await file.exists()) ? file : null;
    };
    const pathResolve = (path: string) => {
      return `/${path}`;
    };
    const isDir = async (path: string) => {
      let isDir;
      try {
        const stats = await stat(path);
        isDir = stats.isDirectory();
      } catch {}
      return isDir;
    };
    return baseServeStatic({
      ...options,
      // @ts-ignore
      getContent,
      pathResolve,
      isDir,
    })(c, next);
  };
};
