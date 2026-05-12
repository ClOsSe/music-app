import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import {
  createUser,
  findAuthUserByEmail,
  findUserByEmail,
} from "../repositories/users.repository";
import type { LoginResponse } from "@music-app/shared";
export async function registerUser(
  db: D1Database,
  email: string,
  password: string
) {
  const existingUser = await findUserByEmail(db, email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return createUser(db, email, passwordHash);
}

export async function loginUser(
  db: D1Database,
  jwtSecret: string,
  email: string,
  password: string
): Promise<LoginResponse> {
  const user = await findAuthUserByEmail(
    db,
    email
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  const token = await sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    },
    jwtSecret
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role as "admin",
    },
  };
}