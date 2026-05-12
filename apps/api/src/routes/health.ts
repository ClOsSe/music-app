import { Hono } from "hono";
import type { HealthResponse } from "@music-app/shared";

export const healthRoutes = new Hono();

healthRoutes.get("/health", (c) => {
  const response: HealthResponse = {
    status: "healthy",
  };

  return c.json(response);
});