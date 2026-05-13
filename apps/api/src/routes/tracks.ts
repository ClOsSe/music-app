import { Hono } from "hono";
import type {
  CreateTrackResponse,
  DeleteTrackResponse,
  UpdateTrackResponse,
} from "@music-app/shared";

import {
  createTrack,
  deleteTrack,
  getTrackById,
  getTracks,
  getTracksPaginated,
  updateTrack,
} from "../services/tracks.service";
import {
  badRequest,
  created,
  notFound,
  ok,
} from "../lib/http";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";
import { getEnv } from "../lib/env";
import type { AppHonoEnv } from "../types/env";
import { createTrackSchema } from "../validators/tracks.schema";
import { validateJson } from "../lib/validation";
import { parseJsonBody } from "../lib/request";

export const tracksRoutes = new Hono<AppHonoEnv>();

tracksRoutes.get("/tracks", async (c) => {
  const env = getEnv(c.env);

  const search = c.req.query("search");
  const page = Number(c.req.query("page") ?? 1);
  const limit = Number(c.req.query("limit") ?? 10);

  if (
    c.req.query("page") ||
    c.req.query("limit") ||
    search
  ) {
    const result = await getTracksPaginated(
      env.DB,
      search,
      Number.isNaN(page) ? 1 : page,
      Number.isNaN(limit) ? 10 : limit
    );

    return c.json(result);
  }

  const tracks = await getTracks(env.DB);

  return c.json(tracks);
});

tracksRoutes.get("/tracks/:id", async (c) => {
  const env = getEnv(c.env);
  const id = Number(c.req.param("id"));

  if (Number.isNaN(id)) {
    return c.json(badRequest("Invalid track id"), 400);
  }

  const track = await getTrackById(env.DB, id);

  if (!track) {
    return c.json(notFound("Track not found"), 404);
  }

  return c.json(track);
});

tracksRoutes.post(
  "/tracks",
  async (c, next) => {
    const env = getEnv(c.env);
    const middleware = requireAuth(env.JWT_SECRET);

    return middleware(c, next);
  },
  requireAdmin,
  async (c) => {
    const env = getEnv(c.env);

    const parsedBody = await parseJsonBody(c);

    if (!parsedBody.success) {
      return parsedBody.response;
    }

    const parsed = validateJson(
      createTrackSchema,
      parsedBody.data
    );

    if (!parsed.success) {
      return c.json(
        badRequest(
          parsed.error.issues[0]?.message ?? "Invalid input"
        ),
        400
      );
    }

    const result = await createTrack(env.DB, parsed.data);

    return c.json(
      created<CreateTrackResponse>({
        id: result.meta.last_row_id,
      }),
      201
    );
  }
);

tracksRoutes.delete(
  "/tracks/:id",
  async (c, next) => {
    const env = getEnv(c.env);
    const middleware = requireAuth(env.JWT_SECRET);

    return middleware(c, next);
  },
  requireAdmin,
  async (c) => {
    const env = getEnv(c.env);
    const id = Number(c.req.param("id"));

    if (Number.isNaN(id)) {
      return c.json(badRequest("Invalid track id"), 400);
    }

    await deleteTrack(env.DB, id);

    return c.json(
      ok<DeleteTrackResponse>({
        id,
      })
    );
  }
);

tracksRoutes.put(
  "/tracks/:id",
  async (c, next) => {
    const env = getEnv(c.env);
    const middleware = requireAuth(env.JWT_SECRET);

    return middleware(c, next);
  },
  requireAdmin,
  async (c) => {
    const env = getEnv(c.env);
    const id = Number(c.req.param("id"));

    if (Number.isNaN(id)) {
      return c.json(badRequest("Invalid track id"), 400);
    }

    const parsedBody = await parseJsonBody(c);

    if (!parsedBody.success) {
      return parsedBody.response;
    }

    const parsed = validateJson(
      createTrackSchema,
      parsedBody.data
    );

    if (!parsed.success) {
      return c.json(
        badRequest(
          parsed.error.issues[0]?.message ?? "Invalid input"
        ),
        400
      );
    }

    await updateTrack(env.DB, id, parsed.data);

    return c.json(
      ok<UpdateTrackResponse>({
        id,
      })
    );
  }
);