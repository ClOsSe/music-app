import { findTrackById } from "../repositories/tracks.repository";

export function getTrackStreamUrl(path: string) {
  return path;
}

export async function getTrackAudioUrl(
  db: D1Database,
  trackId: number
) {
  const track = await findTrackById(db, trackId);

  if (!track) {
    return null;
  }

  return getTrackStreamUrl(track.audio_url);
}