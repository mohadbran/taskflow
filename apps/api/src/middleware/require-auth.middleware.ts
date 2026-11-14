import type { RequestHandler } from "express";

import { AppError } from "../lib/app-error.js";

export const requireAuth: RequestHandler = (
  req,
  _res,
  next,
) => {
  if (!req.user) {
    next(
      new AppError(
        401,
        "UNAUTHENTICATED",
        "Authentication is required.",
      ),
    );

    return;
  }

  next();
};