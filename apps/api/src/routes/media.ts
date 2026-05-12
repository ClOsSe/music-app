import { Hono } from "hono";

import { getEnv } from "../lib/env";
import { notFound } from "../lib/http";
import type { AppHonoEnv } from "../types/env";
import {
  fetchTrackAudio,
  fetchTrackCover,
  getTrackAudioUrl,
  getTrackCoverUrl,
} from "../services/media.service";

export const mediaRoutes = new Hono<AppHonoEnv>();

mediaRoutes.get("/media/health", (c) => {
  return c.json({
    status: "media-ok",
  });
});

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
  <rect width="100%" height="100%" fill="#111827"/>
  <text
    x="50%"
    y="50%"
    dominant-baseline="middle"
    text-anchor="middle"
    fill="white"
    font-size="32"
    font-family="Arial"
  >
    No Cover
  </text>
</svg>
`;


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

async function streamTrackCover(c: any) {
  const env = getEnv(c.env);
  const id = Number(c.req.param("id"));

  if (Number.isNaN(id)) {
    return c.json(notFound("Track not found"), 404);
  }

  const coverUrl = await getTrackCoverUrl(env.DB, id);

  if (!coverUrl) {
    return c.json(notFound("Cover not found"), 404);
  }

  let coverResponse: Response;

  try {
    coverResponse = await fetchTrackCover(coverUrl);
      } catch (error) {
        console.error(
        "COVER_FETCH_ERROR",
        error instanceof Error ? error.message : error
      );

      return new Response(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=3600",
        },
      });
  }

  if (!coverResponse.ok) {
    return c.json(
      {
        success: false,
        message: "Cover source unavailable",
      },
      502
    );
  }

  const headers = new Headers();

  headers.set(
    "Content-Type",
    coverResponse.headers.get("Content-Type") ??
      "image/jpeg"
  );

  const contentLength =
    coverResponse.headers.get("Content-Length");

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  headers.set("Cache-Control", "public, max-age=3600");

  if (c.req.method === "HEAD") {
    return new Response(null, {
      status: 200,
      headers,
    });
  }

  return new Response(coverResponse.body, {
    status: 200,
    headers,
  });
}

mediaRoutes.get("/media/tracks/:id/cover", streamTrackCover);

mediaRoutes.on(
  "HEAD",
  "/media/tracks/:id/cover",
  streamTrackCover
);