import { stringifySetCookie } from "cookie";

import { env } from "../config/env.js";

export const SESSION_COOKIE_NAME = "taskflow_session";

export const SESSION_DURATION_SECONDS =
  7 * 24 * 60 * 60;

export function createSessionCookie(
  sessionId: string,
): string {
  return stringifySetCookie({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function clearSessionCookie(): string {
  return stringifySetCookie({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}