"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createGenre } from "../lib/genres-api";

export function AddGenreForm() {
  const [name, setName] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      await createGenre({
        name,
      });

      setName("");
      router.refresh();
    } catch {
      alert("Create genre failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex gap-2">
      <input
        className="w-full rounded-md border p-2"
        placeholder="New genre name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        type="submit"
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Add
      </button>
    </form>
  );
}
