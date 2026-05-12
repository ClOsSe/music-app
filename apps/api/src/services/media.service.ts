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

export async function fetchTrackAudio(
  audioUrl: string,
  rangeHeader: string | null
) {
  const headers = new Headers();

  if (rangeHeader) {
    headers.set("Range", rangeHeader);
  }

  return fetch(audioUrl, {
    headers,
    signal: AbortSignal.timeout(10000),
  });
}