import { Hono } from "hono";

import { getEnv } from "../lib/env";
import { notFound } from "../lib/http";
import type { AppHonoEnv } from "../types/env";
import {
  fetchTrackAudio,
  getTrackAudioUrl,
} from "../services/media.service";

export const mediaRoutes = new Hono<AppHonoEnv>();

mediaRoutes.get("/media/health", (c) => {
  return c.json({
    status: "media-ok",
  });
});

async function streamTrackAudio(c: any) {
  const env = getEnv(c.env);
  const id = Number(c.req.param("id"));

  if (Number.isNaN(id)) {
    return c.json(notFound("Track not found"), 404);
  }

  const audioUrl = await getTrackAudioUrl(env.DB, id);

  if (!audioUrl) {
    return c.json(notFound("Track not found"), 404);
  }

  const rangeHeader = c.req.header("Range") ?? null;

  let audioResponse: Response;

  try {
    audioResponse = await fetchTrackAudio(
      audioUrl,
      rangeHeader
    );
  } catch {
    return c.json(
      {
        success: false,
        message: "Audio source unavailable",
      },
      502
    );
  }

  if (!audioResponse.ok && audioResponse.status !== 206) {
    return c.json(
      {
        success: false,
        message: "Audio source unavailable",
      },
      502
    );
  }

  const headers = new Headers();

  headers.set(
    "Content-Type",
    audioResponse.headers.get("Content-Type") ??
      "audio/mpeg"
  );

  const contentLength =
    audioResponse.headers.get("Content-Length");
  const contentRange =
    audioResponse.headers.get("Content-Range");
  const acceptRanges =
    audioResponse.headers.get("Accept-Ranges");

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  if (contentRange) {
    headers.set("Content-Range", contentRange);
  }

  headers.set("Accept-Ranges", acceptRanges ?? "bytes");
  headers.set("Cache-Control", "public, max-age=3600");

  if (c.req.method === "HEAD") {
    return new Response(null, {
      status: audioResponse.status,
      headers,
    });
  }

  return new Response(audioResponse.body, {
    status: audioResponse.status,
    headers,
  });
}

mediaRoutes.get(
  "/media/tracks/:id/stream",
  streamTrackAudio
);

mediaRoutes.on(
  "HEAD",
  "/media/tracks/:id/stream",
  streamTrackAudio
);