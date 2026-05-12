import type { PaginatedTracksResponse } from "@music-app/shared";

import { AddTrackForm } from "./add-track-form";
import { AdminAuthGuard } from "./admin-auth-guard";
import { LogoutButton } from "./logout-button";
import { DeleteTrackButton } from "./delete-track-button";
import { EditTrackButton } from "./edit-track-button";
import { TracksSearchForm } from "./tracks-search-form";
import { TracksPagination } from "./tracks-pagination";
import { AudioPreview } from "./audio-preview";
type Props = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
};

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const search = params.search ?? "";
  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 5);

  const query = new URLSearchParams();

  if (search) {
    query.set("search", search);
  }

  query.set("page", String(Number.isNaN(page) ? 1 : page));
  query.set("limit", String(Number.isNaN(limit) ? 5 : limit));

  const res = await fetch(`${apiUrl}/tracks?${query.toString()}`, {
    cache: "no-store",
  });

  const data = (await res.json()) as PaginatedTracksResponse;

  return (
    <main className="min-h-screen p-8">
      <AdminAuthGuard />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        <LogoutButton />
      </div>

      <section className="mt-8">
        <AddTrackForm />

        <div className="mt-8">
          <TracksSearchForm defaultSearch={search} />
        </div>

        <h2 className="mt-8 text-xl font-semibold">Tracks</h2>

        <div className="mt-4 space-y-3">
          {data.items.map((track) => (
            <div key={track.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{track.title}</p>
                  <p className="text-sm text-gray-500">{track.artist}</p>
                  <AudioPreview trackId={track.id} />
                </div>

                <div className="flex gap-2">
                  <EditTrackButton track={track} />
                  <DeleteTrackButton id={track.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <TracksPagination
          page={data.page}
          totalPages={data.total_pages}
          search={search}
        />
      </section>
    </main>
  );
}
