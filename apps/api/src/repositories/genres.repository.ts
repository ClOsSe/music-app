import type {
  CreateGenreInput,
  Genre,
} from "@music-app/shared";

export async function findGenres(db: D1Database) {
  const { results } = await db
    .prepare("SELECT * FROM genres ORDER BY name ASC")
    .all<Genre>();

  return results;
}

export async function findGenreByName(
  db: D1Database,
  name: string
) {
  return db
    .prepare("SELECT * FROM genres WHERE name = ?")
    .bind(name)
    .first<Genre>();
}

export async function insertGenre(
  db: D1Database,
  input: CreateGenreInput
) {
  return db
    .prepare("INSERT INTO genres (name) VALUES (?)")
    .bind(input.name)
    .run();
}

export async function deleteGenreById(
  db: D1Database,
  id: number
) {
  return db
    .prepare("DELETE FROM genres WHERE id = ?")
    .bind(id)
    .run();
}