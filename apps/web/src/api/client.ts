
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(
    status: number,
    code: string,
    message: string,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {

const headers = new Headers(options.headers);

if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
}

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
    });

  const contentType = response.headers.get("content-type");

  const body: unknown = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const errorBody = body as ApiErrorResponse | null;

    throw new ApiError(
      response.status,
      errorBody?.error?.code ?? "REQUEST_FAILED",
      errorBody?.error?.message ?? "An unexpected error occurred.",
    );
  }

  return body as T;
}
