import { Hono } from "hono";
import type { CreateTrackInput } from "@music-app/shared";
import { createTrack, getTracks } from "../services/tracks.service";
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
  const tracks = await getTracks(c.env.DB);

  return c.json(tracks);
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
      created({
        id: result.meta.last_row_id,
      }),
      201
    );
  }
);