import { Hono } from "hono";

import { getTrackAudioUrl } from "../services/media.service";
import { badRequest } from "../lib/http";
import { getEnv } from "../lib/env";
import type { AppBindings } from "./types/env";


export const mediaRoutes = new Hono<{
  Bindings: AppBindings;
}>();

mediaRoutes.get("/media/health", (c) => {
  return c.json({
    status: "media-ok",
  });
});

mediaRoutes.get("/media/tracks/:id/stream", async (c) => {
  const env = getEnv(c.env);

  const id = Number(c.req.param("id"));

  if (Number.isNaN(id)) {
    return c.json(badRequest("Invalid track id"), 400);
  }

  const audioUrl = await getTrackAudioUrl(env.DB, id);

  if (!audioUrl) {
    return c.json(badRequest("Track not found"), 404);
  }

  return c.redirect(audioUrl, 302);
});