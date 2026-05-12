import { jwt } from "hono/jwt";

export function requireAuth(jwtSecret: string) {
  return jwt({
    secret: jwtSecret,
    alg: "HS256",
  });
}