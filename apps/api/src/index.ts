/// <reference types="@cloudflare/workers-types" />
import type { AppHonoEnv } from "./types/env";

import { Hono } from "hono";
import { cors } from "hono/cors";

import { healthRoutes } from "./routes/health";
import { tracksRoutes } from "./routes/tracks";
import { authRoutes } from "./routes/auth";
import { mediaRoutes } from "./routes/media";
import { requestId } from "./middlewares/request-id.middleware";
import { requestLogger } from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/error.middleware";


const app = new Hono<AppHonoEnv>();

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

app.onError(errorHandler);
export default app;