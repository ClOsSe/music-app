"use client";

import { useEffect, useState } from "react";
import type { Genre, PaginatedTracksResponse, Track } from "@music-app/shared";

import { API_URL } from "./lib/api";

type Props = {
  activeGenre: string;
};

export function MusicPlayer({ activeGenre }: Props) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const searchParams = new URLSearchParams();

      searchParams.set("page", "1");
      searchParams.set("limit", "20");

      if (activeGenre && activeGenre !== "All") {
        searchParams.set("genre", activeGenre);
      }

      const [tracksRes, genresRes] = await Promise.all([
        fetch(`${API_URL}/tracks?${searchParams.toString()}`),
        fetch(`${API_URL}/genres`),
      ]);

      if (!tracksRes.ok || !genresRes.ok) {
        throw new Error("Failed to load music data");
      }

      const tracksData = (await tracksRes.json()) as PaginatedTracksResponse;
      const genresData = (await genresRes.json()) as Genre[];

      setTracks(tracksData.items);
      setGenres(genresData);
      setIsLoading(false);
    }

    loadData().catch(() => {
      setTracks([]);
      setGenres([]);
      setIsLoading(false);
    });
  }, [activeGenre]);

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Music App</h1>
          <p className="mt-2 text-sm text-zinc-400">Listen to public tracks</p>
        </header>

        <div className="mb-8 flex flex-wrap gap-2">
          {["All", ...genres.map((genre) => genre.name)].map((genre) => {
            const href =
              genre === "All" ? "/" : `/?genre=${encodeURIComponent(genre)}`;

            const isActive = activeGenre === genre;

            return (
              <a
                key={genre}
                href={href}
                className={
                  isActive
                    ? "rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
                    : "rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
                }
              >
                {genre}
              </a>
            );
          })}
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">
            Loading...
          </div>
        ) : tracks.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">
            No tracks found.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${API_URL}/media/tracks/${track.id}/cover`}
                    alt={`${track.title} cover`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-4">
                  <h2 className="line-clamp-1 font-semibold">{track.title}</h2>
                  <p className="line-clamp-1 text-sm text-zinc-400">
                    {track.artist}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{track.genre}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentTrack(track)}
                  className="mt-4 w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-black"
                >
                  Play
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {currentTrack ? (
        <div className="fixed inset-x-0 bottom-0 border-t border-zinc-800 bg-zinc-950 p-4">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{currentTrack.title}</p>
              <p className="truncate text-sm text-zinc-400">
                {currentTrack.artist}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{currentTrack.genre}</p>
            </div>

            <audio
              controls
              autoPlay
              className="w-full sm:w-130"
              src={`${API_URL}/media/tracks/${currentTrack.id}/stream`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
