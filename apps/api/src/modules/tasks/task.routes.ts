import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/require-auth.middleware.js";

import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  listTasksController,
  updateTaskController,
} from "./task.controller.js";

const router = Router();

router.use(requireAuth);

router.post("/", createTaskController);

router.get("/", listTasksController);

router.get("/:id", getTaskController);

router.patch("/:id", updateTaskController);

router.delete("/:id", deleteTaskController);

export default router;