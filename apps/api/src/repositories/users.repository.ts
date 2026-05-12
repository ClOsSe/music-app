import type { User } from "@music-app/shared";

export async function findUserByEmail(
  db: D1Database,
  email: string
) {
  return db
    .prepare(
      `
      SELECT id, email, role, created_at
      FROM users
      WHERE email = ?
      `
    )
    .bind(email)
    .first<User>();
}
export async function findAuthUserByEmail(
  db: D1Database,
  email: string
) {
  return db
    .prepare(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `
    )
    .bind(email)
    .first<{
      id: number;
      email: string;
      password_hash: string;
      role: string;
    }>();
}

export async function createUser(
  db: D1Database,
  email: string,
  passwordHash: string
) {
  return db
    .prepare(
      `
      INSERT INTO users (
        email,
        password_hash
      )
      VALUES (?, ?)
      `
    )
    .bind(email, passwordHash)
    .run();
}