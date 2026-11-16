# TaskFlow — Project Context & Handoff

**Last updated:** 2026-11-16

**Purpose:** Describe the implementation currently present in the repository, its conventions, verification status, and practical next steps for continuing development.

---

## 1. Project Overview

TaskFlow is a hands-on learning project for building a full-stack task management application using modern TypeScript tooling and industry-oriented practices. The repository currently contains an Express API and a React UI for authentication and personal task management.

### Technology stack

- **Monorepo:** pnpm workspaces
- **Backend:** Node.js, Express 5, TypeScript
- **Database:** SQLite
- **ORM:** Drizzle ORM
- **Validation:** Zod
- **Password hashing:** Argon2id (`argon2`)
- **Authentication:** Server-side sessions stored in SQLite; opaque session ID in an HttpOnly cookie
- **Frontend:** React, Vite, TypeScript
- **Frontend routing/forms:** React Router, React Hook Form, Zod resolver
- **Styling:** Tailwind CSS

The user prefers a **step-by-step, hands-on curriculum**, beginner-friendly explanations, sound architecture, and complete files with paths and application instructions.

---

## 2. Project Structure

The repository is located at:

```text
D:\SW-DEV-TEAM\TECH-LABS\react-ts\taskflow
```

The project is a pnpm monorepo:

```text
taskflow/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── config/          # API environment defaults
│   │   │   ├── controllers/     # Health endpoint controller
│   │   │   ├── db/              # Drizzle connection, schemas, seed, relations
│   │   │   ├── lib/             # App errors, request user, session cookie
│   │   │   ├── middleware/      # Auth/session and error handling
│   │   │   ├── modules/
│   │   │   │   ├── auth/        # Register/login/logout/me
│   │   │   │   └── tasks/       # Task CRUD API
│   │   │   ├── routes/
│   │   │   ├── services/        # Health service
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── drizzle/             # Committed SQL migration(s)
│   │   ├── drizzle.config.ts
│   │   ├── taskflow.db          # local DB when created; gitignored
│   │   └── package.json
│   └── web/
│       ├── src/
│       │   ├── api/             # Shared fetch client
│       │   ├── context/         # Auth context/provider
│       │   ├── features/
│       │   │   ├── auth/        # Auth API, forms, pages, schemas
│       │   │   └── tasks/       # Task API, forms, list, dashboard
│       │   ├── routes/          # Guest and protected route guards
│       │   ├── App.tsx
│       │   └── main.tsx
│       └── package.json
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── taskflow-project-context.md
└── ...
```

Root development commands include:

```bash
pnpm dev
pnpm typecheck
pnpm build
```

The root typecheck script invokes workspace typechecks recursively:

```text
pnpm typecheck
  └── pnpm --recursive typecheck
```

At present, only `apps/api` defines a `typecheck` script. The web app's `build` script runs `tsc -b` before Vite, so `pnpm build` typechecks and builds both workspaces. There is no root lint or test script.

---

## 3. Progress Summary

| Phase | Topic | Status |
|---|---|---|
| Phase 1 | Monorepo, TypeScript, Express, React/Vite, Tailwind | Completed |
| Phase 2 | Express backend architecture | Completed |
| Phase 3 | SQLite + Drizzle foundation | Completed |
| Phase 4 | Task CRUD API | Implemented |
| Phase 5 | Backend session authentication | Implemented |
| Phase 6 | React authentication UI and task dashboard | Implemented: auth, create/list/edit/complete tasks |

**Current point:** The repository contains the full basic flow from registration/login through authenticated task management. Runtime behavior and automated tests still need verification; see [Known State and Verification](#11-known-state-and-verification) for specific gaps.

---

## 4. Phase 1 — Foundation

Established:

- pnpm monorepo
- `apps/api` for Express + TypeScript
- `apps/web` for React + Vite + TypeScript + Tailwind
- Backend on port `4000`
- Frontend on port `5173`
- Frontend now uses the API for authentication and task management; the health endpoint remains available for API checks.

---

## 5. Phase 2 — Backend Architecture

The backend began with this structure:

```text
apps/api/src/
├── config/
│   └── env.ts
├── controllers/
│   └── health.controller.ts
├── middleware/
│   ├── error.middleware.ts
│   └── not-found.middleware.ts
├── routes/
│   ├── health.routes.ts
│   └── index.ts
├── services/
│   └── health.service.ts
├── lib/
│   └── app-error.ts
├── app.ts
└── server.ts
```

### Architecture principles

- Controllers handle HTTP concerns and remain thin.
- Services contain application/business logic and database operations.
- Controllers should not directly import or query the database.
- Routes map HTTP endpoints to controllers.
- Middleware handles cross-cutting concerns.
- `src/lib` contains generic application utilities.
- `src/config` contains configuration.
- Feature-specific code should live under `src/modules/<feature>` as the app grows.
- No global `models/` directory is used; database schema/types are under `src/db`.

### Error handling

`AppError` is used for expected application errors. `notFoundMiddleware` creates a route-not-found error, and `errorMiddleware` produces consistent JSON responses.

The API response conventions include:

```json
{
  "data": {}
}
```

and:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable error message"
  }
}
```

---

## 6. Phase 3 — SQLite + Drizzle

### Dependencies

Installed in `apps/api`:

```bash
pnpm add drizzle-orm better-sqlite3
pnpm add -D drizzle-kit @types/better-sqlite3
```

### Database files

```text
apps/api/
├── src/
│   └── db/
│       ├── index.ts
│       ├── relations.ts
│       ├── seed.ts
│       └── schema/
│           ├── users.ts
│           ├── sessions.ts
│           └── tasks.ts
├── drizzle/
│   └── generated SQL migrations
├── drizzle.config.ts
└── taskflow.db
```

### `apps/api/drizzle.config.ts`

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/*.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./taskflow.db",
  },
  strict: true,
  verbose: true,
});
```

### `apps/api/src/db/index.ts`

```ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqlite = new Database("taskflow.db");

sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite);
```

### `users` schema

`apps/api/src/db/schema/users.ts`

```ts
import type {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id")
    .primaryKey({ autoIncrement: true }),

  name: text("name")
    .notNull(),

  email: text("email")
    .notNull()
    .unique(),

  passwordHash: text("password_hash")
    .notNull(),

  createdAt: integer("created_at", {
    mode: "timestamp_ms",
  }).notNull(),

  updatedAt: integer("updated_at", {
    mode: "timestamp_ms",
  }).notNull(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
```

### `sessions` schema

`apps/api/src/db/schema/sessions.ts`

```ts
import type {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import {
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { users } from "./users.js";

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    expiresAt: integer("expires_at", {
      mode: "timestamp_ms",
    }).notNull(),

    createdAt: integer("created_at", {
      mode: "timestamp_ms",
    }).notNull(),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
  ],
);

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;
```

### `tasks` schema

`apps/api/src/db/schema/tasks.ts`

```ts
import type {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import {
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { users } from "./users.js";

export const tasks = sqliteTable(
  "tasks",
  {
    id: integer("id")
      .primaryKey({ autoIncrement: true }),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    title: text("title").notNull(),

    description: text("description"),

    completed: integer("completed", {
      mode: "boolean",
    })
      .notNull()
      .default(false),

    createdAt: integer("created_at", {
      mode: "timestamp_ms",
    }).notNull(),

    updatedAt: integer("updated_at", {
      mode: "timestamp_ms",
    }).notNull(),
  },
  (table) => [
    index("tasks_user_id_idx").on(table.userId),
  ],
);

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;
```

### Relations

`apps/api/src/db/relations.ts` defines:

- `usersRelations`: one user has many sessions and tasks
- `sessionsRelations`: each session belongs to one user
- `tasksRelations`: each task belongs to one user

Foreign keys are database constraints. Drizzle relations describe ORM-level relationships.

### Database commands

From `apps/api`:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Schema source is `src/db/schema/*.ts`; migrations are in `drizzle/`; local database is `taskflow.db` and is gitignored. Migrations should be committed. Seed data is not a migration.

### Health endpoint

```text
GET http://localhost:4000/api/health
```

It checks the database using:

```ts
await db.run(sql`SELECT 1`);
```

---

## 7. Phase 4 — Task CRUD API

### Feature structure

```text
apps/api/src/modules/tasks/
├── task.controller.ts
├── task.routes.ts
├── task.schemas.ts
├── task.service.ts
└── task.types.ts
```

### Dependencies

Zod was installed:

```bash
pnpm add zod
```

### CRUD endpoints

| Method | Endpoint | Behavior |
|---|---|---|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | List current user's tasks |
| GET | `/api/tasks/:id` | Retrieve one owned task |
| PATCH | `/api/tasks/:id` | Update owned task |
| DELETE | `/api/tasks/:id` | Delete owned task |

### Task schemas

`task.schemas.ts` contains:

- `taskIdSchema`
- `createTaskSchema`
- `updateTaskSchema`
- `listTasksQuerySchema`
- inferred `CreateTaskInput`, `UpdateTaskInput`, and `ListTasksQuery`

Create validation:
- title: trimmed, 1–200 characters
- description: optional, nullable, up to 2,000 characters
- completed: optional boolean

Update validation:
- same fields optional
- at least one field required

List query:
- `completed=true|false`
- `limit` 1–100, default 20
- `offset` default 0

### Task API types

`task.types.ts` defines `TaskResponse`, intentionally excluding `userId`, and `toTaskResponse()` to control the API representation.

### Ownership

Every task service operation scopes queries by `userId`. For example:

```ts
where(
  and(
    eq(tasks.id, taskId),
    eq(tasks.userId, userId),
  ),
)
```

This ensures a user cannot access another user's task by guessing its ID. Not-found behavior intentionally avoids revealing whether another user's task exists.

---

## 8. Phase 5 — Backend Authentication

### Dependencies

Installed in `apps/api`:

```bash
pnpm add argon2 cookie cors
pnpm add -D @types/cors
```

Authentication is based on **opaque server-side sessions**, not JWTs.

### Authentication endpoints

| Method | Endpoint | Behavior |
|---|---|---|
| POST | `/api/auth/register` | Register account and establish session |
| POST | `/api/auth/login` | Verify password and establish session |
| POST | `/api/auth/logout` | Delete current session and clear cookie |
| GET | `/api/auth/me` | Return authenticated user's profile |

### Authentication module

```text
apps/api/src/modules/auth/
├── auth.controller.ts
├── auth.routes.ts
├── auth.schemas.ts
├── auth.service.ts
└── auth.types.ts
```

### Authentication middleware/utilities

```text
apps/api/src/
├── lib/
│   ├── app-error.ts
│   ├── request-user.ts
│   └── session-cookie.ts
├── middleware/
│   ├── error.middleware.ts
│   ├── not-found.middleware.ts
│   ├── require-auth.middleware.ts
│   └── session.middleware.ts
└── types/
    └── express.d.ts
```

The temporary `dev-user.middleware.ts` from Phase 4 was removed.

### Password security

Passwords are hashed using Argon2id:

```ts
const passwordHash = await argon2.hash(
  input.password,
  { type: argon2.argon2id },
);
```

Login verifies the hash using:

```ts
await argon2.verify(user.passwordHash, input.password);
```

Plaintext passwords are never stored.

### Session creation

Session IDs are cryptographically random:

```ts
const sessionId = randomBytes(32).toString("hex");
```

Sessions are persisted in SQLite with:

- ID
- user ID
- expiration
- creation timestamp

Session duration is seven days:

```ts
export const SESSION_DURATION_SECONDS =
  7 * 24 * 60 * 60;
```

### Cookie configuration

Cookie name:

```text
taskflow_session
```

Cookie attributes:

- `httpOnly: true`
- `secure: env.isProduction`
- `sameSite: "lax"`
- `path: "/"`
- `maxAge`: seven days

### Important cookie package compatibility fix

The initial Phase 5 implementation used the old `cookie` API:

```ts
import { serialize } from "cookie";
import { parse } from "cookie";
```

Typechecking failed because the installed `cookie` package uses the v2 API.

The fix was applied successfully:

**`apps/api/src/lib/session-cookie.ts` uses:**

```ts
import { stringifySetCookie } from "cookie";
```

and calls `stringifySetCookie({...})` to create and clear cookies.

**`apps/api/src/middleware/session.middleware.ts` uses:**

```ts
import { parseCookie } from "cookie";
```

and:

```ts
const cookies = parseCookie(
  req.headers.cookie ?? "",
);
```

This resolved the TypeScript errors.

### Session middleware behavior

`sessionMiddleware`:

1. Parses the `taskflow_session` cookie.
2. Finds the session in SQLite and joins its user.
3. Checks expiration.
4. Deletes expired sessions and clears the cookie.
5. Sets `req.user` and `req.sessionId` for valid sessions.
6. Leaves requests unauthenticated if no valid session exists.

### Express request augmentation

`apps/api/src/types/express.d.ts`:

```ts
export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        email: string;
      };

      sessionId?: string;
    }
  }
}
```

### Authentication guard

`require-auth.middleware.ts` rejects unauthenticated requests with:

```text
401 UNAUTHENTICATED
```

### User helper

`apps/api/src/lib/request-user.ts` exposes:

```ts
getUserId(req)
```

It throws a 401 if `req.user` is absent; otherwise it returns the authenticated user's ID.

Task controllers continue to use this helper. Task services continue to scope queries by user ID.

### CORS and frontend cookies

`apps/api/src/app.ts` configures:

```ts
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
```

Frontend API calls must use:

```ts
fetch(url, {
  credentials: "include",
});
```

The frontend's default URL is:

```text
http://localhost:5173
```

The backend's default URL is:

```text
http://localhost:4000
```

### Authentication testing note

The seed user contains a deliberately fake password hash:

```ts
passwordHash: "not-a-real-password-hash"
```

Do not try to log in using the seed user. Register a new user through `/api/auth/register`, which generates a real Argon2id hash.

No migration was needed for Phase 5 because the existing users and sessions schemas already support authentication.

---

## 9. Current API Request Flow

### Authenticated task request

```text
HTTP request
    ↓
Express app
    ↓
sessionMiddleware
    ↓
req.user / req.sessionId
    ↓
requireAuth
    ↓
Task routes
    ↓
Task controller
    ↓
Zod validation
    ↓
Task service
    ↓
Drizzle
    ↓
SQLite
```

### Login/register request

```text
HTTP request
    ↓
Auth route
    ↓
Auth controller
    ↓
Zod validation
    ↓
Auth service
    ├── Argon2id
    ├── User persistence
    └── Session persistence
    ↓
Set-Cookie
    ↓
Browser stores HttpOnly session cookie
```

---

## 10. Current Implementation Conventions

Keep these decisions unless implementation evidence shows a real need to change them:

1. Use TypeScript throughout this learning project.
2. Keep the monorepo and pnpm workspaces.
3. Use feature-oriented modules (`modules/auth`, `modules/tasks`).
4. Keep controllers thin.
5. Put application logic and database operations in services.
6. Keep Drizzle schema under `src/db/schema`.
7. Use Zod for input validation.
8. Infer input types from Zod schemas where appropriate.
9. Keep API response types separate from database models.
10. Never expose password hashes.
11. Scope task queries to the authenticated user.
12. Use centralized error handling.
13. Use server-side sessions for authentication.
14. Avoid unnecessary repository classes, dependency injection, Redux, or architecture layers at this stage.
15. Implement one phase at a time; do not redesign the architecture before completing the implementation.

---

## 11. Known State and Verification

### Implemented in the repository

- Phases 1–5 are present: workspace setup, API architecture, SQLite/Drizzle, task API, and server-side session authentication.
- The web app has login and registration pages. React Hook Form and Zod provide client-side validation; registration also checks matching passwords.
- `AuthProvider` calls `/auth/me` on startup, stores the current user, and exposes login/register/logout actions.
- `GuestRoute` and `ProtectedRoute` gate auth pages and `/dashboard`, showing a loading state during session initialization.
- The shared web API client uses `credentials: "include"` for requests and turns non-2xx responses into `ApiError`.
- The dashboard loads the current user's tasks, displays a completion count, and supports create, edit, toggle-completed, refresh, and logout actions.
- The API additionally supports task deletion and list filtering/pagination. The current dashboard does not expose a delete action and uses the API's default list parameters.
- Registration/login API endpoints set the HttpOnly session cookie; `/auth/me` and logout are protected by session middleware. Tasks are protected and scoped to the current user.

### Verification status and follow-up

- No test files were found under `apps/`, and neither workspace package currently defines a test script.
- This context refresh inspected implementation and package scripts; it did not run the application or verify browser/API flows.
- Exercise registration, login, session restore after refresh, logout, task create/list/edit/toggle, API deletion, ownership isolation, and expired-session handling before treating runtime behavior as verified.
- The web `Task` type declares `id: string`, while the API/database task ID is numeric. Align the frontend type with the actual response (or deliberately normalize the API representation) before relying on ID typing.
- Add a task deletion control if deletion is intended to be part of the current UI; the API client already exports `deleteTask`.
- Root `pnpm typecheck` runs scripts available in workspaces; currently that is the API typecheck. `pnpm build` also typechecks the web app as part of its build.

---

## 12. Current Frontend Implementation

The actual frontend layout is feature-oriented:

```text
apps/web/src/
├── api/client.ts
├── context/AuthContext.tsx
├── features/
│   ├── auth/
│   │   ├── components/LoginForm.tsx
│   │   ├── components/RegisterForm.tsx
│   │   ├── pages/LoginPage.tsx
│   │   ├── pages/RegisterPage.tsx
│   │   ├── schemas/auth.schema.ts
│   │   ├── auth.api.ts
│   │   └── auth.types.ts
│   └── tasks/
│       ├── components/CreateTaskForm.tsx
│       ├── components/EditTaskForm.tsx
│       ├── components/TaskItem.tsx
│       ├── components/TaskList.tsx
│       ├── pages/DashboardPage.tsx
│       ├── schemas/task.schema.ts
│       ├── task.api.ts
│       └── task.types.ts
├── routes/GuestRoute.tsx
├── routes/ProtectedRoute.tsx
├── App.tsx
└── main.tsx
```

`App.tsx` maps `/login`, `/register`, and `/dashboard`; `/` redirects to the dashboard and unknown paths redirect to `/`. The dashboard is under `ProtectedRoute`, while auth pages use `GuestRoute`. Both route guards depend on the auth provider's startup `/auth/me` request.

`apps/web/src/api/client.ts` reads `VITE_API_URL`, defaulting to `http://localhost:4000/api`, sends cookies with every API request, and parses the API's `{ data }` / `{ error }` envelopes. The API CORS origin is configured with `CLIENT_URL` (default `http://localhost:5173`).

The task page currently implements the main day-to-day flow, but not every backend operation. Keep the known UI/API gaps in Section 11 in mind before extending the interface.

---

## 13. How to Continue in a New Chat

Start the next conversation by attaching or pasting this document and asking to continue from the code that is already present. For example:

> Continue my TaskFlow project from the current repository and this context. The API, server-side authentication, React login/register flow, protected routes, and task dashboard are already implemented. First help verify the existing flows and address the documented frontend task ID mismatch; do not recreate Phase 6 or redesign the architecture. Then recommend the next small step and explain it in a beginner-friendly, hands-on way.

Do not restart the Phase 6 implementation from scratch: the React auth UI and task dashboard are already in the repository. First reconcile the frontend task ID type with the API response, add or plan tests, and verify the flows listed in Section 11. Then choose the next feature with the user.

---

## 14. Quick Reference

### Root

```bash
pnpm dev
pnpm typecheck
pnpm build
```

`pnpm typecheck` currently covers the API workspace only. `pnpm build` compiles the API and runs the web TypeScript build plus Vite production build.

### Web

```bash
pnpm --filter web build
pnpm --filter web lint
```

### API

```bash
pnpm --filter @taskflow/api dev
pnpm --filter @taskflow/api typecheck
pnpm --filter @taskflow/api db:seed
```

### API endpoints

```text
GET    /api/health

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

### Local URLs

```text
Frontend: http://localhost:5173
Backend:  http://localhost:4000
Health:   http://localhost:4000/api/health
```

---

**End of TaskFlow project context.**
