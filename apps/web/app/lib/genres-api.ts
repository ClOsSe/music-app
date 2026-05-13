import type {
  ApiSuccess,
  CreateGenreInput,
  Genre,
  GenreMutationResponse,
} from "@music-app/shared";

import { apiFetch } from "./fetcher";

export function getGenres() {
  return apiFetch<Genre[]>("/genres");
}

export function createGenre(input: CreateGenreInput) {
  return apiFetch<ApiSuccess<GenreMutationResponse>>(
    "/genres",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}

export function deleteGenre(id: number) {
  return apiFetch<ApiSuccess<GenreMutationResponse>>(
    `/genres/${id}`,
    {
      method: "DELETE",
    }
  );
}