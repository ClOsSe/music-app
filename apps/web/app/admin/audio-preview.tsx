"use client";

import { API_URL } from "../lib/api";

type Props = {
  trackId: number;
};

export function AudioPreview({ trackId }: Props) {
  return (
    <audio
      controls
      className="mt-3 w-full"
      src={`${API_URL}/media/tracks/${trackId}/stream`}
    />
  );
}
