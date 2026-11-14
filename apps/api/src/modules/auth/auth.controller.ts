import type { RequestHandler } from "express";

import { AppError } from "../../lib/app-error.js";
import {
  clearSessionCookie,
  createSessionCookie,
} from "../../lib/session-cookie.js";

import {
  authenticateUser,
  createSession,
  deleteSession,
  registerUser,
} from "./auth.service.js";

import {
  loginSchema,
  registerSchema,
} from "./auth.schemas.js";

import {
  toPublicUser,
} from "./auth.types.js";

export const registerController: RequestHandler =
  async (req, res) => {
    const input = registerSchema.parse(req.body);

    const user = await registerUser(input);

    const session = await createSession(user.id);

    res.append(
      "Set-Cookie",
      createSessionCookie(session.id),
    );

    res.status(201).json({
      data: {
        user: toPublicUser(user),
      },
    });
  };

export const loginController: RequestHandler =
  async (req, res) => {
    const input = loginSchema.parse(req.body);

    const user = await authenticateUser(input);

    const session = await createSession(user.id);

    res.append(
      "Set-Cookie",
      createSessionCookie(session.id),
    );

    res.status(200).json({
      data: {
        user: toPublicUser(user),
      },
    });
  };

export const logoutController: RequestHandler =
  async (req, res) => {
    if (req.sessionId) {
      await deleteSession(req.sessionId);
    }

    res.append(
      "Set-Cookie",
      clearSessionCookie(),
    );

    res.status(204).send();
  };

export const meController: RequestHandler =
  (req, res) => {
    if (!req.user) {
      throw new AppError(
        401,
        "UNAUTHENTICATED",
        "Authentication is required.",
      );
    }

    res.status(200).json({
      data: {
        user: req.user,
      },
    });
  };