import type {
  ApiSuccess,
  CreateTrackInput,
  Track,
} from "@music-app/shared";

import { apiFetch } from "./fetcher";

type TrackMutationResponse = ApiSuccess<{
  id: number;
}>;

export function getTracks() {
  return apiFetch<Track[]>("/tracks");
}

export function createTrack(input: CreateTrackInput) {
  return apiFetch<TrackMutationResponse>("/tracks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTrack(id: number, input: CreateTrackInput) {
  return apiFetch<TrackMutationResponse>(`/tracks/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteTrack(id: number) {
  return apiFetch<TrackMutationResponse>(`/tracks/${id}`, {
    method: "DELETE",
  });
}