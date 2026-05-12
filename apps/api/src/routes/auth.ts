import { Hono } from "hono";
import type {
  LoginInput,
  RegisterInput,
} from "@music-app/shared";


import {
  loginUser,
  registerUser,
} from "../services/auth.service";
import { badRequest, created } from "./lib/http";

import type { RegisterResponse } from "@music-app/shared";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

export const authRoutes = new Hono<{ Bindings: Bindings }>();

authRoutes.post("/auth/register", async (c) => {
  try {
    const body = await c.req.json<RegisterInput>();

    if (!body.email || !body.password) {
      return c.json(
        badRequest("Email and password are required"),
        400
      );
    }

    const result = await registerUser(
      c.env.DB,
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
    const body = await c.req.json<LoginInput>();

    if (!body.email || !body.password) {
      return c.json(
        badRequest("Email and password are required"),
        400
      );
    }

    const user = await loginUser(
      c.env.DB,
      c.env.JWT_SECRET,
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