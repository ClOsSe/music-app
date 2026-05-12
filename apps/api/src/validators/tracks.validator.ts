import type { CreateTrackInput } from "@music-app/shared";

export function validateCreateTrackInput(input: CreateTrackInput) {
  if (!input.title) {
    return "Title is required";
  }

  if (!input.artist) {
    return "Artist is required";
  }

  if (!input.audio_url) {
    return "Audio URL is required";
  }

  return null;
}