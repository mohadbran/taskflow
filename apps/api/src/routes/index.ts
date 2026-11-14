import { Router } from "express";

import healthRoutes from "./health.routes.js";

import authRoutes from "../modules/auth/auth.routes.js";

import taskRoutes from "../modules/tasks/task.routes.js";

import {
  sessionMiddleware,
} from "../middleware/session.middleware.js";

import {
  requireAuth,
} from "../middleware/require-auth.middleware.js";

const router = Router();

router.use("/health", healthRoutes);

router.use("/auth", authRoutes);

router.use(
  "/tasks",
  sessionMiddleware,
  requireAuth,
  taskRoutes,
);

export default router;