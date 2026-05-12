import { jwt } from "hono/jwt";
import type { Context, Next } from "hono";

import { unauthorized } from "../lib/http";

export function requireAuth(jwtSecret: string) {
  const middleware = jwt({
    secret: jwtSecret,
    alg: "HS256",
  });

  return async (c: Context, next: Next) => {
    try {
      return await middleware(c, next);
    } catch {
      return c.json(unauthorized(), 401);
    }
  };
}