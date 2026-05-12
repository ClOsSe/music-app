"use client";

import { useState } from "react";
import { API_URL, authHeaders } from "../lib/api";

export function AddTrackForm() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }
    const res = await fetch(`${API_URL}/tracks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        title,
        artist,
        audio_url: audioUrl,
        cover_url: coverUrl,
      }),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      alert(data?.message ?? text ?? "Create track failed");
      return;
    }

    alert("Track created");
    window.location.reload();

    setTitle("");
    setArtist("");
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
