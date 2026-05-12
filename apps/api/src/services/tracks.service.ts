import type { CreateTrackInput, Track } from "@music-app/shared";
import { findTracks, insertTrack } from "../repositories/tracks.repository";

export async function getTracks(db: D1Database) {
  return findTracks(db);
}

export async function createTrack(
  db: D1Database,
  input: CreateTrackInput
) {
  return insertTrack(db, input);
}