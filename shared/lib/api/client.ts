import { API_URL } from "@/shared/lib/auth/cookies";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

type FetchOptions = RequestInit & {
  token?: string | null;
  searchParams?: Record<string, string | number | undefined | null>;
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, searchParams, headers, ...rest } = options;
  const url = new URL(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  let data: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      (data as { message?: string })?.message ||
      `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}
