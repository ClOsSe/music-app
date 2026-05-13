"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTrack } from "../lib/tracks-api";
import type { Genre } from "@music-app/shared";

type Props = {
  genres: Genre[];
};

export function AddTrackForm({ genres }: Props) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [audioUrl, setAudioUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    await createTrack({
      title,
      artist,
      genre,
      audio_url: audioUrl,
      cover_url: coverUrl || null,
    });

    router.refresh();

    setTitle("");
    setArtist("");
    setGenre("Pop");
    setAudioUrl("");
    setCoverUrl("");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <input
          className="w-full rounded-md border p-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <input
          className="w-full rounded-md border p-2"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      </div>

      <div>
        <select
          className="w-full rounded-md border p-2"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {genres.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          className="w-full rounded-md border p-2"
          placeholder="Audio URL"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
        />
      </div>

      <div>
        <input
          className="w-full rounded-md border p-2"
          placeholder="Cover URL"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Add Track
      </button>
    </form>
  );
}
