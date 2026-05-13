import type {
  ApiSuccess,
  CreateTrackInput,
  CreateTrackResponse,
  DeleteTrackResponse,
  PaginatedTracksResponse,
  Track,
  UpdateTrackResponse,
} from "@music-app/shared";

import { apiFetch } from "./fetcher";

export function getTracks() {
  return apiFetch<Track[]>("/tracks");
}

export function getTracksPaginated(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  return apiFetch<PaginatedTracksResponse>(
    `/tracks?${searchParams.toString()}`
  );
}

export function createTrack(input: CreateTrackInput) {
  return apiFetch<ApiSuccess<CreateTrackResponse>>("/tracks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTrack(
  id: number,
  input: CreateTrackInput
) {
  return apiFetch<ApiSuccess<UpdateTrackResponse>>(
    `/tracks/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    }
  );
}

export function deleteTrack(id: number) {
  return apiFetch<ApiSuccess<DeleteTrackResponse>>(
    `/tracks/${id}`,
    {
      method: "DELETE",
    }
  );
}