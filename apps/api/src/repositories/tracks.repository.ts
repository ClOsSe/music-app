import type { CreateTrackInput, Track } from "@music-app/shared";

export async function findTracks(db: D1Database) {
  const { results } = await db
    .prepare("SELECT * FROM tracks ORDER BY created_at DESC")
    .all<Track>();

  return results;
}

export async function insertTrack(
  db: D1Database,
  input: CreateTrackInput
) {
  const {
    title,
    artist,
    genre,
    audio_url,
    cover_url = null,
  } = input;

  return db
    .prepare(
      `
      INSERT INTO tracks (
        title,
        artist,
        genre,
        audio_url,
        cover_url
      )
      VALUES (?, ?, ?, ?, ?)
      `
    )
    .bind(title, artist, genre, audio_url, cover_url)
    .run();
}

export async function deleteTrackById(
  db: D1Database,
  id: number
) {
  return db
    .prepare("DELETE FROM tracks WHERE id = ?")
    .bind(id)
    .run();
}

export async function updateTrackById(
  db: D1Database,
  id: number,
  input: CreateTrackInput
) {
  const {
    title,
    artist,
    genre,
    audio_url,
    cover_url = null,
  } = input;

  return db
    .prepare(
      `
      UPDATE tracks
      SET title = ?,
          artist = ?,
          genre = ?,
          audio_url = ?,
          cover_url = ?
      WHERE id = ?
      `
    )
    .bind(title, artist, genre, audio_url, cover_url, id)
    .run();
}

export async function findTrackById(
  db: D1Database,
  id: number
) {
  return db
    .prepare("SELECT * FROM tracks WHERE id = ?")
    .bind(id)
    .first<Track>();
}

export async function findTracksPaginated(
  db: D1Database,
  search: string | undefined,
  genre: string | undefined,
  limit: number,
  offset: number
) {
  const hasSearch = Boolean(search);
  const hasGenre = Boolean(genre && genre !== "All");

  if (hasSearch && hasGenre) {
    const q = `%${search}%`;

    const { results } = await db
      .prepare(
        `
        SELECT *
        FROM tracks
        WHERE genre = ?
          AND (
            title LIKE ?
            OR artist LIKE ?
            OR genre LIKE ?
          )
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
        `
      )
      .bind(genre, q, q, q, limit, offset)
      .all<Track>();

    return results;
  }

  if (hasGenre) {
    const { results } = await db
      .prepare(
        `
        SELECT *
        FROM tracks
        WHERE genre = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
        `
      )
      .bind(genre, limit, offset)
      .all<Track>();

    return results;
  }

  if (hasSearch) {
    const q = `%${search}%`;

    const { results } = await db
      .prepare(
        `
        SELECT *
        FROM tracks
        WHERE title LIKE ?
           OR artist LIKE ?
           OR genre LIKE ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
        `
      )
      .bind(q, q, q, limit, offset)
      .all<Track>();

    return results;
  }

  const { results } = await db
    .prepare(
      `
      SELECT *
      FROM tracks
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `
    )
    .bind(limit, offset)
    .all<Track>();

  return results;
}

export async function countTracks(
  db: D1Database,
  search?: string,
  genre?: string
) {
  const hasSearch = Boolean(search);
  const hasGenre = Boolean(genre && genre !== "All");

  if (hasSearch && hasGenre) {
    const q = `%${search}%`;

    const row = await db
      .prepare(
        `
        SELECT COUNT(*) as total
        FROM tracks
        WHERE genre = ?
          AND (
            title LIKE ?
            OR artist LIKE ?
            OR genre LIKE ?
          )
        `
      )
      .bind(genre, q, q, q)
      .first<{ total: number }>();

    return row?.total ?? 0;
  }

  if (hasGenre) {
    const row = await db
      .prepare(
        `
        SELECT COUNT(*) as total
        FROM tracks
        WHERE genre = ?
        `
      )
      .bind(genre)
      .first<{ total: number }>();

    return row?.total ?? 0;
  }

  if (hasSearch) {
    const q = `%${search}%`;

    const row = await db
      .prepare(
        `
        SELECT COUNT(*) as total
        FROM tracks
        WHERE title LIKE ?
           OR artist LIKE ?
           OR genre LIKE ?
        `
      )
      .bind(q, q, q)
      .first<{ total: number }>();

    return row?.total ?? 0;
  }

  const row = await db
    .prepare("SELECT COUNT(*) as total FROM tracks")
    .first<{ total: number }>();

  return row?.total ?? 0;
}