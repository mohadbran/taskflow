import type { RequestHandler } from "express";
import { getHealth } from "../services/health.service.js";

export const getHealthController: RequestHandler = async (
  _req,
  res,
) => {
  const health = await getHealth();

  res.status(200).json({
    data: health,
  });
};