import { Hono } from "hono";
import type { CreateTrackInput,
  CreateTrackResponse,
  DeleteTrackResponse,
  UpdateTrackResponse, } from "@music-app/shared";
import { createTrack,
  deleteTrack,
  getTrackById,
  getTracks,
  getTracksPaginated,
  updateTrack,
 } from "../services/tracks.service";
import { validateCreateTrackInput } from "../validators/tracks.validator";
import { badRequest, created } from "./lib/http";
import { requireAuth } from "../middlewares/auth.middleware";
import { getCurrentUser } from "./lib/auth";
import { requireAdmin } from "../middlewares/admin.middleware";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

export const tracksRoutes = new Hono<{ Bindings: Bindings }>();

tracksRoutes.get("/tracks", async (c) => {
  const search = c.req.query("search");
  const page = Number(c.req.query("page") ?? 1);
  const limit = Number(c.req.query("limit") ?? 10);

  if (
    c.req.query("page") ||
    c.req.query("limit") ||
    search
  ) {
    const result = await getTracksPaginated(
      c.env.DB,
      search,
      Number.isNaN(page) ? 1 : page,
      Number.isNaN(limit) ? 10 : limit
    );

    return c.json(result);
  }

  const tracks = await getTracks(c.env.DB);

  return c.json(tracks);
});
tracksRoutes.get("/tracks/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (Number.isNaN(id)) {
    return c.json(badRequest("Invalid track id"), 400);
  }

  const track = await getTrackById(c.env.DB, id);

  if (!track) {
    return c.json(badRequest("Track not found"), 404);
  }

  return c.json(track);
});


tracksRoutes.post(
  "/tracks",
  async (c, next) => {
    const middleware = requireAuth(c.env.JWT_SECRET);

    return middleware(c, next);
  },
  requireAdmin,
  async (c) => {
    const user = getCurrentUser(c);
    console.log(user);
    const body = await c.req.json<CreateTrackInput>();
    

    const error = validateCreateTrackInput(body);

    if (error) {
      return c.json(badRequest(error), 400);
    }

    const result = await createTrack(c.env.DB, body);

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
    const middleware = requireAuth(c.env.JWT_SECRET);
    return middleware(c, next);
  },
  requireAdmin,
  async (c) => {
    const id = Number(c.req.param("id"));

    if (Number.isNaN(id)) {
      return c.json(badRequest("Invalid track id"), 400);
    }

    await deleteTrack(c.env.DB, id);

    return c.json({
      success: true,
      data: {
        id,
      } satisfies DeleteTrackResponse,
    });
  }
);

tracksRoutes.put(
  "/tracks/:id",
  async (c, next) => {
    const middleware = requireAuth(c.env.JWT_SECRET);
    return middleware(c, next);
  },
  requireAdmin,
  async (c) => {
    const id = Number(c.req.param("id"));

    if (Number.isNaN(id)) {
      return c.json(badRequest("Invalid track id"), 400);
    }

    const body = await c.req.json<CreateTrackInput>();

    const error = validateCreateTrackInput(body);

    if (error) {
      return c.json(badRequest(error), 400);
    }

    await updateTrack(c.env.DB, id, body);

    return c.json({
      success: true,
      data: {
        id,
      } satisfies UpdateTrackResponse,
    });
  }
);