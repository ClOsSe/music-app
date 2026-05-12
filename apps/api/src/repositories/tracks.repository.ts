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
  const { title, artist, audio_url, cover_url = null } = input;

  return db
    .prepare(
      `
      INSERT INTO tracks (
        title,
        artist,
        audio_url,
        cover_url
      )
      VALUES (?, ?, ?, ?)
      `
    )
    .bind(title, artist, audio_url, cover_url)
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
  const { title, artist, audio_url, cover_url = null } = input;

  return db
    .prepare(
      `
      UPDATE tracks
      SET title = ?,
          artist = ?,
          audio_url = ?,
          cover_url = ?
      WHERE id = ?
      `
    )
    .bind(title, artist, audio_url, cover_url, id)
    .run();
}