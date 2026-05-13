import { z } from "zod";

export const createGenreSchema = z.object({
  name: z.string().min(1, "Genre name is required"),
});

export type CreateGenreSchema = z.infer<
  typeof createGenreSchema
>;