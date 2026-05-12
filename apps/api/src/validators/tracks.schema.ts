import { z } from "zod";

export const createTrackSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  audio_url: z
    .string()
    .min(1, "Audio URL is required"),
  cover_url: z.string().nullable().optional(),
});

export type CreateTrackSchema = z.infer<
  typeof createTrackSchema
>;