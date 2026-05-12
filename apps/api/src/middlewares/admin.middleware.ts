import type { Context, Next } from "hono";

export async function requireAdmin(
  c: Context,
  next: Next
) {
  const payload = c.get("jwtPayload") as {
    role?: string;
  };

  if (payload.role !== "admin") {
    return c.json(
      {
        success: false,
        message: "Forbidden",
      },
      403
    );
  }

  await next();
}