import type { Genre, PaginatedTracksResponse } from "@music-app/shared";

import { API_URL } from "./lib/api";
import { MusicPlayer } from "./music-player";

type Props = {
  searchParams: Promise<{
    genre?: string;
  }>;
};

async function getPublicData(genre?: string) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", "1");
  searchParams.set("limit", "20");

  if (genre && genre !== "All") {
    searchParams.set("genre", genre);
  }

  const [tracksRes, genresRes] = await Promise.all([
    fetch(`${API_URL}/tracks?${searchParams.toString()}`, {
      cache: "no-store",
    }),
    fetch(`${API_URL}/genres`, {
      cache: "no-store",
    }),
  ]);

  if (!tracksRes.ok) {
    throw new Error("Failed to fetch tracks");
  }

  if (!genresRes.ok) {
    throw new Error("Failed to fetch genres");
  }

  const tracksData = (await tracksRes.json()) as PaginatedTracksResponse;

  const genres = (await genresRes.json()) as Genre[];

  return {
    tracks: tracksData.items,
    genres,
  };
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const activeGenre = params.genre ?? "All";

  const { tracks, genres } = await getPublicData(activeGenre);

  return (
    <MusicPlayer tracks={tracks} genres={genres} activeGenre={activeGenre} />
  );
}
