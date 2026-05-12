import type { Track } from "@music-app/shared";

import { AddTrackForm } from "./add-track-form";
import { AdminAuthGuard } from "./admin-auth-guard";
import { LogoutButton } from "./logout-button";
import { AdminUser } from "./admin-user";
import { DeleteTrackButton } from "./delete-track-button";

export default async function AdminPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${apiUrl}/tracks`, {
    cache: "no-store",
  });

  const tracks = (await res.json()) as Track[];

  return (
    <main className="min-h-screen p-8">
      <AdminAuthGuard />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <AdminUser />
        </div>

        <LogoutButton />
      </div>

      <section className="mt-8">
        <AddTrackForm />

        <h2 className="mt-8 text-xl font-semibold">Tracks</h2>

        <div className="mt-4 space-y-3">
          {tracks.map((track) => (
            <div key={track.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{track.title}</p>
                  <p className="text-sm text-gray-500">{track.artist}</p>
                </div>

                <DeleteTrackButton id={track.id} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
