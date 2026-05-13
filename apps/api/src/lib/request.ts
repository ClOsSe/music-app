import type { Context } from "hono";

import { badRequest } from "./http";

type ParseJsonResult =
  | {
      success: true;
      data: unknown;
    }
  | {
      success: false;
      response: Response;
    };

export async function parseJsonBody(
  c: Context
): Promise<ParseJsonResult> {
  try {
    return {
      success: true,
      data: await c.req.json(),
    };
  } catch {
    return {
      success: false,
      response: c.json(
        badRequest("Invalid JSON body"),
        400
      ),
    };
  }
}