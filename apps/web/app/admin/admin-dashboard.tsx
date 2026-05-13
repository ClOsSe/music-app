"use client";

import { useEffect, useState } from "react";
import type { Genre, PaginatedTracksResponse } from "@music-app/shared";

import { API_URL } from "./../lib/api";
import { AddTrackForm } from "./add-track-form";
import { AdminAuthGuard } from "./admin-auth-guard";
import { LogoutButton } from "./logout-button";
import { DeleteTrackButton } from "./delete-track-button";
import { EditTrackButton } from "./edit-track-button";
import { TracksSearchForm } from "./tracks-search-form";
import { TracksPagination } from "./tracks-pagination";
import { AudioPreview } from "./audio-preview";
import { AddGenreForm } from "./add-genre-form";
import { DeleteGenreButton } from "./delete-genre-button";

type Props = {
  defaultSearch: string;
  defaultPage: string;
  defaultLimit: string;
};

export function AdminDashboard({
  defaultSearch,
  defaultPage,
  defaultLimit,
}: Props) {
  const [data, setData] = useState<PaginatedTracksResponse | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const page = Number(defaultPage);
  const limit = Number(defaultLimit);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const query = new URLSearchParams();

      if (defaultSearch) {
        query.set("search", defaultSearch);
      }

      query.set("page", String(Number.isNaN(page) ? 1 : page));
      query.set("limit", String(Number.isNaN(limit) ? 5 : limit));

      const [tracksRes, genresRes] = await Promise.all([
        fetch(`${API_URL}/tracks?${query.toString()}`),
        fetch(`${API_URL}/genres`),
      ]);

      if (!tracksRes.ok || !genresRes.ok) {
        throw new Error("Failed to load admin data");
      }

      const tracksData = (await tracksRes.json()) as PaginatedTracksResponse;
      const genresData = (await genresRes.json()) as Genre[];

      setData(tracksData);
      setGenres(genresData);
      setIsLoading(false);
    }

    loadData().catch(() => {
      setData(null);
      setGenres([]);
      setIsLoading(false);
    });
  }, [defaultSearch, limit, page]);

  return (
    <main className="min-h-screen p-8">
      <AdminAuthGuard />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        <LogoutButton />
      </div>

      {isLoading ? (
        <div className="rounded-lg border p-4">Loading...</div>
      ) : (
        <>
          <section className="rounded-lg border p-4">
            <h2 className="text-xl font-semibold">Genres</h2>

            <AddGenreForm />

            <div className="mt-4 flex flex-wrap gap-2">
              {genres.map((genre) => (
                <div
                  key={genre.id}
                  className="flex items-center gap-2 rounded-full border px-3 py-2"
                >
                  <span className="text-sm">{genre.name}</span>
                  <DeleteGenreButton id={genre.id} />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <AddTrackForm genres={genres} />

            <div className="mt-8">
              <TracksSearchForm defaultSearch={defaultSearch} />
            </div>

            <h2 className="mt-8 text-xl font-semibold">Tracks</h2>

            <div className="mt-4 space-y-3">
              {data?.items.map((track) => (
                <div key={track.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{track.title}</p>
                      <p className="text-sm text-gray-500">{track.artist}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {track.genre}
                      </p>
                      <AudioPreview trackId={track.id} />
                    </div>

                    <div className="flex gap-2">
                      <EditTrackButton track={track} genres={genres} />
                      <DeleteTrackButton id={track.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data ? (
              <TracksPagination
                page={data.page}
                totalPages={data.total_pages}
                search={defaultSearch}
              />
            ) : null}
          </section>
        </>
      )}
    </main>
  );
}
