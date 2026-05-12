import { AddTrackForm } from "./add-track-form";
import { AdminAuthGuard } from "./admin-auth-guard";
import { LogoutButton } from "./logout-button";
export default async function AdminPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${apiUrl}/tracks`, {
    cache: "no-store",
  });

  const tracks = await res.json();

  return (
    <>
      <main className="min-h-screen p-8">
        <AdminAuthGuard />
        <LogoutButton />
        <h1 className="text-3xl font-bold">Admin Panel</h1>

        <section className="mt-8">
          <AddTrackForm />
          <h2 className="text-xl font-semibold">Tracks</h2>

          <pre className="mt-4 rounded-lg border p-4">
            {JSON.stringify(tracks, null, 2)}
          </pre>
        </section>
      </main>
    </>
  );
}
