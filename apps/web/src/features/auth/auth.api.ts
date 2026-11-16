
import { apiFetch } from "../../api/client";

import type {
  AuthResponse,
  LoginInput,
  MeResponse,
  RegisterInput,
  User,
} from "./auth.types";

export async function login(input: LoginInput): Promise<User> {
  const response = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return response.data.user;
}

export async function register(
  input: RegisterInput,
): Promise<User> {
  const response = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return response.data.user;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiFetch<MeResponse>("/auth/me");

    return response.data.user;
  } catch (error) {
    // No valid session means the user is unauthenticated.
    // Other errors should remain visible to the caller.
    if (
      error instanceof Error &&
      "status" in error &&
      error.status === 401
    ) {
      return null;
    }

    throw error;
  }
}

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", {
    method: "POST",
  });
}
