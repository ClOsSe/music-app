import type { Context } from "hono";
import { apiError } from "../lib/http";
import type { AppHonoEnv } from "../types/env";

export function errorHandler(
  error: Error,
  c: Context<AppHonoEnv>
) {
  const requestId = c.get("requestId");

  console.error(
    [
      requestId,
      "ERROR",
      c.req.method,
      c.req.path,
      error.message,
    ].join(" ")
  );

  return c.json(apiError("Internal server error"), 500);
}