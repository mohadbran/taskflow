import type { RequestHandler } from "express";

import { parseCookie  } from "cookie";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { sessions } from "../db/schema/sessions.js";
import { users } from "../db/schema/users.js";

import {
  clearSessionCookie,
  SESSION_COOKIE_NAME,
} from "../lib/session-cookie.js";

export const sessionMiddleware: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const cookies = parseCookie (
      req.headers.cookie ?? "",
    );

    const sessionId =
      cookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
      next();
      return;
    }

    const [session] = await db
      .select({
        id: sessions.id,
        userId: users.id,
        name: users.name,
        email: users.email,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .innerJoin(
        users,
        eq(sessions.userId, users.id),
      )
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (!session) {
      res.append(
        "Set-Cookie",
        clearSessionCookie(),
      );

      next();
      return;
    }

    if (session.expiresAt <= new Date()) {
      await db
        .delete(sessions)
        .where(eq(sessions.id, sessionId));

      res.append(
        "Set-Cookie",
        clearSessionCookie(),
      );

      next();
      return;
    }

    req.user = {
      id: session.userId,
      name: session.name,
      email: session.email,
    };

    req.sessionId = session.id;

    next();
  } catch (error) {
    next(error);
  }
};