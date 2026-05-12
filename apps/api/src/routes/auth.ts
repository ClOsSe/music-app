import { Hono } from "hono";
import type {
  LoginResponse,
  RegisterResponse,
} from "@music-app/shared";

import { getEnv } from "../lib/env";
import type { AppHonoEnv } from "../types/env";
import {
  loginUser,
  registerUser,
} from "../services/auth.service";
import { badRequest, created } from "../lib/http";
import {
  loginSchema,
  registerSchema,
} from "../validators/auth.schema";

export const authRoutes = new Hono<AppHonoEnv>();

authRoutes.post("/auth/register", async (c) => {
  try {
    const env = getEnv(c.env);
    const body = await c.req.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        badRequest(
          parsed.error.issues[0]?.message ?? "Invalid input"
        ),
        400
      );
    }

    const result = await registerUser(
      env.DB,
      parsed.data.email,
      parsed.data.password
    );

    return c.json(
      created<RegisterResponse>({
        id: result.meta.last_row_id as number,
      }),
      201
    );
  } catch (error) {
    return c.json(
      badRequest(
        error instanceof Error
          ? error.message
          : "Register failed"
      ),
      400
    );
  }
});

authRoutes.post("/auth/login", async (c) => {
  try {
    const env = getEnv(c.env);
    const body = await c.req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        badRequest(
          parsed.error.issues[0]?.message ?? "Invalid input"
        ),
        400
      );
    }

    const user = await loginUser(
      env.DB,
      env.JWT_SECRET,
      parsed.data.email,
      parsed.data.password
    );

    return c.json(
      created<LoginResponse>(user),
      200
    );
  } catch (error) {
    return c.json(
      badRequest(
        error instanceof Error ? error.message : "Login failed"
      ),
      400
    );
  }
});