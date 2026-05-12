import type { CreateTrackInput, PaginatedTracksResponse } from "@music-app/shared";
import { deleteTrackById,findTracks, insertTrack ,updateTrackById ,
  countTracks,
  findTrackById,
  findTracksPaginated,
} from "../repositories/tracks.repository";

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
export async function getTrackById(
  db: D1Database,
  id: number
) {
  return findTrackById(db, id);
}

export async function getTracksPaginated(
  db: D1Database,
  search: string | undefined,
  page: number,
  limit: number
): Promise<PaginatedTracksResponse> {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const offset = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    findTracksPaginated(db, search, safeLimit, offset),
    countTracks(db, search),
  ]);

  return {
    items,
    page: safePage,
    limit: safeLimit,
    total,
    total_pages: Math.ceil(total / safeLimit),
  };
}