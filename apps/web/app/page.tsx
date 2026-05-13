import type { PaginatedTracksResponse } from "@music-app/shared";

import { API_URL } from "./lib/api";
import { MusicPlayer } from "./music-player";

type Props = {
  searchParams: Promise<{
    genre?: string;
  }>;
};

async function getPublicTracks(genre?: string) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", "1");
  searchParams.set("limit", "20");

  if (genre && genre !== "All") {
    searchParams.set("genre", genre);
  }

  const res = await fetch(`${API_URL}/tracks?${searchParams.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tracks");
  }

  const response = (await res.json()) as PaginatedTracksResponse;

  return response.items;
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const genre = params.genre ?? "All";
  const tracks = await getPublicTracks(genre);

  return <MusicPlayer tracks={tracks} activeGenre={genre} />;
}
