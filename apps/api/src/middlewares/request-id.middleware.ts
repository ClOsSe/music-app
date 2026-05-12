import type { Context, Next } from "hono";

export async function requestId(
  c: Context,
  next: Next
) {
  const id = crypto.randomUUID();

  c.set("requestId", id);

  await next();

  c.res.headers.set("X-Request-Id", id);
}