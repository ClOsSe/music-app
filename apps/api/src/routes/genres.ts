import { Hono } from "hono";
import type { GenreMutationResponse } from "@music-app/shared";

import { getEnv } from "../lib/env";
import {
  badRequest,
  created,
  ok,
} from "../lib/http";
import { parseJsonBody } from "../lib/request";
import { validateJson } from "../lib/validation";
import { requireAdmin } from "../middlewares/admin.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createGenre,
  deleteGenre,
  getGenres,
} from "../services/genres.service";
import type { AppHonoEnv } from "../types/env";
import { createGenreSchema } from "../validators/genres.schema";

export const genresRoutes = new Hono<AppHonoEnv>();

genresRoutes.get("/genres", async (c) => {
  const env = getEnv(c.env);
  const genres = await getGenres(env.DB);

  return c.json(genres);
});

genresRoutes.post(
  "/genres",
  async (c, next) => {
    const env = getEnv(c.env);
    const middleware = requireAuth(env.JWT_SECRET);

    return middleware(c, next);
  },
  requireAdmin,
  async (c) => {
    try {
      const env = getEnv(c.env);

      const parsedBody = await parseJsonBody(c);

      if (!parsedBody.success) {
        return parsedBody.response;
      }

      const parsed = validateJson(
        createGenreSchema,
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

      const result = await createGenre(env.DB, parsed.data);

      return c.json(
        created<GenreMutationResponse>({
          id: result.meta.last_row_id,
        }),
        201
      );
    } catch (error) {
      return c.json(
        badRequest(
          error instanceof Error
            ? error.message
            : "Create genre failed"
        ),
        400
      );
    }
  }
);

genresRoutes.delete(
  "/genres/:id",
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
      return c.json(badRequest("Invalid genre id"), 400);
    }

    await deleteGenre(env.DB, id);

    return c.json(
      ok<GenreMutationResponse>({
        id,
      })
    );
  }
);