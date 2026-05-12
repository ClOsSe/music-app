import type { Context, Next } from "hono";

export async function requestLogger(
  c: Context,
  next: Next
) {
  const start = Date.now();

  await next();

  const duration = Date.now() - start;
  const requestId = c.get("requestId");

  console.log(
    [
      requestId,
      c.req.method,
      c.req.path,
      c.res.status,
      `${duration}ms`,
    ].join(" ")
  );
}