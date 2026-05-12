import type { Context, Next } from "hono";
import { forbidden } from "../lib/http";

export async function requireAdmin(
  c: Context,
  next: Next
) {
  const payload = c.get("jwtPayload") as {
    role?: string;
  };

  if (payload.role !== "admin") {
    return c.json(forbidden(), 403);
  }

  await next();
}