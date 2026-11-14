import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/require-auth.middleware.js";

import {
  sessionMiddleware,
} from "../../middleware/session.middleware.js";

import {
  loginController,
  logoutController,
  meController,
  registerController,
} from "./auth.controller.js";

const router = Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post(
  "/logout",
  sessionMiddleware,
  requireAuth,
  logoutController,
);

router.get(
  "/me",
  sessionMiddleware,
  requireAuth,
  meController,
);

export default router;