import type { PaginatedTracksResponse } from "@music-app/shared";

import { API_URL } from "./lib/api";
import { MusicPlayer } from "./music-player";

async function getPublicTracks() {
  const res = await fetch(`${API_URL}/tracks?page=1&limit=20`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tracks");
  }

  const response = (await res.json()) as PaginatedTracksResponse;

  return response.items;
}

export default async function HomePage() {
  const tracks = await getPublicTracks();

  return <MusicPlayer tracks={tracks} />;
}
