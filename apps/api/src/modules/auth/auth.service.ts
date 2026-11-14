import argon2 from "argon2";
import { randomBytes } from "node:crypto";

import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { sessions } from "../../db/schema/sessions.js";
import { users } from "../../db/schema/users.js";

import { AppError } from "../../lib/app-error.js";
import {
  SESSION_DURATION_SECONDS,
} from "../../lib/session-cookie.js";

import type {
  LoginInput,
  RegisterInput,
} from "./auth.schemas.js";

export async function registerUser(
  input: RegisterInput,
) {
  const passwordHash = await argon2.hash(
    input.password,
    {
      type: argon2.argon2id,
    },
  );

  const now = new Date();

  try {
    const [user] = await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        passwordHash,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!user) {
      throw new AppError(
        500,
        "USER_CREATE_FAILED",
        "The user could not be created.",
      );
    }

    return user;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      throw new AppError(
        409,
        "EMAIL_ALREADY_EXISTS",
        "An account with this email already exists.",
      );
    }

    throw error;
  }
}

export async function authenticateUser(
  input: LoginInput,
) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (!user) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Invalid email or password.",
    );
  }

  const passwordIsValid = await argon2.verify(
    user.passwordHash,
    input.password,
  );

  if (!passwordIsValid) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Invalid email or password.",
    );
  }

  return user;
}

export async function createSession(
  userId: number,
) {
  const sessionId = randomBytes(32).toString("hex");

  const now = new Date();

  const expiresAt = new Date(
    now.getTime() +
      SESSION_DURATION_SECONDS * 1000,
  );

  await db
    .insert(sessions)
    .values({
      id: sessionId,
      userId,
      expiresAt,
      createdAt: now,
    });

  return {
    id: sessionId,
    expiresAt,
  };
}

export async function deleteSession(
  sessionId: string,
) {
  await db
    .delete(sessions)
    .where(eq(sessions.id, sessionId));
}