import type { CreateTrackInput } from "@music-app/shared";
import { deleteTrackById,findTracks, insertTrack ,updateTrackById} from "../repositories/tracks.repository";

export async function getTracks(db: D1Database) {
  return findTracks(db);
}

export async function createTrack(
  db: D1Database,
  input: CreateTrackInput
) {
  return insertTrack(db, input);
}
export async function deleteTrack(
  db: D1Database,
  id: number
) {
  return deleteTrackById(db, id);
}


export async function updateTrack(
  db: D1Database,
  id: number,
  input: CreateTrackInput
) {
  return updateTrackById(db, id, input);
}