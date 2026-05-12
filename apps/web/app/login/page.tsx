"use client";
import type { ApiError, ApiSuccess, LoginResponse } from "@music-app/shared";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = (await res.json()) as ApiSuccess<LoginResponse> | ApiError;

      if (!data.success) {
        alert(data.message);
        return;
      }

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
