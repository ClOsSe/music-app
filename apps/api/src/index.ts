/// <reference types="@cloudflare/workers-types" />

import { Hono } from "hono";
import { cors } from "hono/cors";

import { healthRoutes } from "./routes/health";
import { tracksRoutes } from "./routes/tracks";
import { authRoutes } from "./routes/auth";
import { mediaRoutes } from "./routes/media";
import { requestLogger } from "./middlewares/logger.middleware";

import { requestId } from "./middlewares/request-id.middleware";


const app = new Hono();

app.use("*", cors());
app.use("*", requestId);
app.use("*", requestLogger);

app.get("/", (c) => {
  return c.json({
    name: "music-api",
    status: "ok",
  });
});

app.route("/", healthRoutes);
app.route("/", tracksRoutes);
app.route("/", authRoutes);
app.route("/", mediaRoutes);

export default app;