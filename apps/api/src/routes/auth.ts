import { Hono } from "hono";
import { getEnv } from "../lib/env";
import type {  AppHonoEnv } from "../types/env";

import type {
  LoginInput,
  RegisterInput,
} from "@music-app/shared";


import {
  loginUser,
  registerUser,
} from "../services/auth.service";
import { badRequest, created } from "../lib/http";

import type { RegisterResponse } from "@music-app/shared";



export const authRoutes = new Hono<AppHonoEnv>();

authRoutes.post("/auth/register", async (c) => {
  try {
    const env = getEnv(c.env);

    const body = await c.req.json<RegisterInput>();

    if (!body.email || !body.password) {
      return c.json(
        badRequest("Email and password are required"),
        400
      );
    }

    const result = await registerUser(
      env.DB,
      body.email,
      body.password
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

    const body = await c.req.json<LoginInput>();

    if (!body.email || !body.password) {
      return c.json(
        badRequest("Email and password are required"),
        400
      );
    }

    const user = await loginUser(
      env.DB,
      env.JWT_SECRET,
      body.email,
      body.password
    );

    return c.json(
      created(user),
      200
    );
  } catch (error) {
    return c.json(
      badRequest(
        error instanceof Error
          ? error.message
          : "Login failed"
      ),
      400
    );
  }
});