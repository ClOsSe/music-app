import type { Context, Next } from "hono";
import type { AppHonoEnv } from "../types/env";

export async function requestId(
  c: Context<AppHonoEnv>,
  next: Next
) {
  const id = crypto.randomUUID();

  c.set("requestId", id);

  await next();

  c.res.headers.set("X-Request-Id", id);
}