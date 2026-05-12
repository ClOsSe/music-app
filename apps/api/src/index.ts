import { Hono } from "hono";
import type { HealthResponse } from "@music-app/shared";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    name: "music-api",
    status: "ok",
  });
});

app.get("/health", (c) => {
  const response: HealthResponse = {
    status: "healthy",
  };

  return c.json(response);
});

export default app;