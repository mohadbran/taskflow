import type { Request } from "express";

import { AppError } from "./app-error.js";

export function getUserId(req: Request): number {
  if (!req.user) {
    throw new AppError(
      401,
      "UNAUTHENTICATED",
      "Authentication is required.",
    );
  }

  return req.user.id;
}