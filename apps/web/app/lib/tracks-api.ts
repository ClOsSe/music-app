import type {
  ApiSuccess,
  CreateTrackInput,
  CreateTrackResponse,
  DeleteTrackResponse,
  Track,
  UpdateTrackResponse,
} from "@music-app/shared";

import { apiFetch } from "./fetcher";

export function getTracks() {
  return apiFetch<Track[]>("/tracks");
}

export function createTrack(input: CreateTrackInput) {
  return apiFetch<ApiSuccess<CreateTrackResponse>>("/tracks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTrack(id: number, input: CreateTrackInput) {
  return apiFetch<ApiSuccess<UpdateTrackResponse>>(`/tracks/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteTrack(id: number) {
  return apiFetch<ApiSuccess<DeleteTrackResponse>>(`/tracks/${id}`, {
    method: "DELETE",
  });
}