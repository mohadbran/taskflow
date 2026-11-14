import type { User } from "../../db/schema/users.js";

export type PublicUser = Pick<
  User,
  "id" | "name" | "email" | "createdAt"
>;

export function toPublicUser(
  user: User,
): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}