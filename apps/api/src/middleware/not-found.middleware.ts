import type { RequestHandler } from "express";
import { AppError } from "../lib/app-error.js";

export const notFoundMiddleware: RequestHandler = (
  req,
  _res,
  next,
) => {
  next(
    new AppError(
      404,
      "ROUTE_NOT_FOUND",
      `Route ${req.method} ${req.originalUrl} not found.`,
    ),
  );
};