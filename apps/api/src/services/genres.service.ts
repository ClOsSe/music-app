import type { CreateGenreInput } from "@music-app/shared";

import {
  deleteGenreById,
  findGenreByName,
  findGenres,
  insertGenre,
} from "../repositories/genres.repository";

export function getGenres(db: D1Database) {
  return findGenres(db);
}

export async function createGenre(
  db: D1Database,
  input: CreateGenreInput
) {
  const name = input.name.trim();

  const existing = await findGenreByName(db, name);

  if (existing) {
    throw new Error("Genre already exists");
  }

  return insertGenre(db, {
    name,
  });
}

export function deleteGenre(
  db: D1Database,
  id: number
) {
  return deleteGenreById(db, id);
}