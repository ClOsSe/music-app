import type { Context } from "hono";
type JwtPayload = {
  sub: number;
  email: string;
  role: string;
};
export function getCurrentUser(c: Context) {
  const payload = c.get("jwtPayload") as JwtPayload;

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}