import type { ZodSchema } from "zod";

export function validateJson<T>(
  schema: ZodSchema<T>,
  body: unknown
) {
  return schema.safeParse(body);
}