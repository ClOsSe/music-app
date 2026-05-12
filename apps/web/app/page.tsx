export default async function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${apiUrl}/health`, {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Music App</h1>

      <div className="mt-6 rounded-lg border p-4">
        <p>API Status:</p>
        <pre className="mt-2">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </main>
  );
}
