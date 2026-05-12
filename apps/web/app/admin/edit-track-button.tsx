"use client";

import { useState } from "react";
import type { Track } from "@music-app/shared";
import { updateTrack } from "../lib/tracks-api";
import { useRouter } from "next/navigation";
type Props = {
  track: Track;
};

export function EditTrackButton({ track }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(track.title);
  const [artist, setArtist] = useState(track.artist);
  const [audioUrl, setAudioUrl] = useState(track.audio_url);
  const [coverUrl, setCoverUrl] = useState(track.cover_url ?? "");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await updateTrack(track.id, {
        title,
        artist,
        audio_url: audioUrl,
        cover_url: coverUrl || null,
      });

      router.refresh();
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
      />
      <input
        className="w-full rounded border px-3 py-2"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <input
        className="w-full rounded border px-3 py-2"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
      />
      <input
        className="w-full rounded border px-3 py-2"
        value={coverUrl}
        onChange={(e) => setCoverUrl(e.target.value)}
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
