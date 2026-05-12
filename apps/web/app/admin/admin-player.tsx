"use client";

import { useState } from "react";
import type { Track } from "@music-app/shared";
import { API_URL } from "../lib/api";

type Props = {
  tracks: Track[];
};

export function AdminPlayer({ tracks }: Props) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  return (
    <>
      <div className="space-y-4 pb-28">
        {tracks.map((track) => (
          <div key={track.id} className="rounded-lg border p-4">
            <div className="flex gap-4">
              <img
                src={`${API_URL}/media/tracks/${track.id}/cover`}
                alt={track.title}
                className="h-20 w-20 rounded-md object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{track.title}</h3>
                <p className="text-sm text-gray-500">{track.artist}</p>

                <button
                  type="button"
                  onClick={() => setCurrentTrack(track)}
                  className="mt-3 rounded-md border px-3 py-1 text-sm"
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
          <div className="mx-auto flex max-w-4xl items-center gap-4">
            <img
              src={`${API_URL}/media/tracks/${currentTrack.id}/cover`}
              alt={currentTrack.title}
              className="h-14 w-14 rounded-md object-cover"
            />

            <div className="w-48">
              <p className="truncate font-medium">{currentTrack.title}</p>
              <p className="truncate text-sm text-gray-500">
                {currentTrack.artist}
              </p>
            </div>

            <audio
              key={currentTrack.id}
              controls
              autoPlay
              className="flex-1"
              src={`${API_URL}/media/tracks/${currentTrack.id}/stream`}
            />
          </div>
        </div>
      )}
    </>
  );
}
