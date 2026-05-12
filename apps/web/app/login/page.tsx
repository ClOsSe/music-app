"use client";
import type { ApiSuccess, LoginResponse } from "@music-app/shared";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/fetcher";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await apiFetch<ApiSuccess<LoginResponse>>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem("token", data.data.token);

      router.push("/admin");
    } catch {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <form onSubmit={onSubmit} className="w-full space-y-4">
        <h1 className="text-3xl font-bold">Admin Login</h1>

        <input
          className="w-full rounded-md border p-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded-md border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black p-3 text-white"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </main>
  );
}
