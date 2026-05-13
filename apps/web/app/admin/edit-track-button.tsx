"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Track } from "@music-app/shared";

import { updateTrack } from "../lib/tracks-api";

type Props = {
  track: Track;
};

export function EditTrackButton({ track }: Props) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(track.title);
  const [artist, setArtist] = useState(track.artist);
  const [genre, setGenre] = useState(track.genre);
  const [audioUrl, setAudioUrl] = useState(track.audio_url);
  const [coverUrl, setCoverUrl] = useState(track.cover_url ?? "");

  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await updateTrack(track.id, {
        title,
        artist,
        genre,
        audio_url: audioUrl,
        cover_url: coverUrl || null,
      });

      router.refresh();
      setOpen(false);
    } catch {
      alert("Update failed");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded border px-2 py-1"
      >
        Edit
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-2">
      <input
        className="w-full rounded border px-3 py-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <input
        className="w-full rounded border px-3 py-2"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        placeholder="Artist"
      />

      <select
        className="w-full rounded border px-3 py-2"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      >
        <option value="Pop">Pop</option>
        <option value="Traditional">Traditional</option>
        <option value="Rap">Rap</option>
        <option value="Rock">Rock</option>
      </select>

      <input
        className="w-full rounded border px-3 py-2"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
        placeholder="Audio URL"
      />

      <input
        className="w-full rounded border px-3 py-2"
        value={coverUrl}
        onChange={(e) => setCoverUrl(e.target.value)}
        placeholder="Cover URL"
      />

      <div className="flex gap-2">
        <button className="rounded border px-3 py-1">Save</button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded border px-3 py-1"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
