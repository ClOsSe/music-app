import { Hono } from "hono";

export const mediaRoutes = new Hono();

mediaRoutes.get("/media/health", (c) => {
  return c.json({
    status: "media-ok",
  });
});