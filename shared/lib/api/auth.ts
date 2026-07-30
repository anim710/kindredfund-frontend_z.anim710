import { apiFetch } from "./client";
import type { AuthPayload, User } from "@/shared/types";

export const authApi = {
  login: (body: { email: string; password: string }) =>
    apiFetch<{ success: boolean } & AuthPayload & { data: AuthPayload }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify(body) }
    ),

  register: (body: {
    name: string;
    email: string;
    password: string;
    role?: "Supporter" | "Creator";
  }) =>
    apiFetch<{ success: boolean } & AuthPayload & { data: AuthPayload }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(body) }
    ),

  google: (body: { idToken: string }) =>
    apiFetch<{ success: boolean } & AuthPayload & { data: AuthPayload }>(
      "/auth/google-login",
      { method: "POST", body: JSON.stringify(body) }
    ),

  me: (token: string) =>
    apiFetch<{ success: boolean; user: User; data?: { user: User } }>(
      "/auth/me",
      { token }
    ),

  refresh: (refreshToken: string) =>
    apiFetch<{
      success: boolean;
      token: string;
      refreshToken: string;
      data?: { token: string; refreshToken: string };
    }>("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  forgotPassword: (email: string) =>
    apiFetch<{ success: boolean; message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (body: { token: string; newPassword: string }) =>
    apiFetch<{ success: boolean; message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: (token: string) =>
    apiFetch<{ success: boolean }>("/auth/logout", {
      method: "POST",
      token,
    }),
};

export function pickAuthPayload(res: {
  token?: string;
  refreshToken?: string;
  user?: User;
  data?: Partial<AuthPayload>;
}): AuthPayload {
  return {
    token: res.data?.token || res.token!,
    refreshToken: res.data?.refreshToken || res.refreshToken!,
    user: res.data?.user || res.user!,
  };
}
