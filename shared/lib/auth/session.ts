import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
} from "@/shared/lib/auth/cookies";
import { authApi, pickAuthPayload } from "@/shared/lib/api/auth";
import type { AuthPayload } from "@/shared/types";

export async function setSessionCookies(payload: AuthPayload) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, payload.token, cookieOptions(60 * 15));
  jar.set(REFRESH_COOKIE, payload.refreshToken, cookieOptions(60 * 60 * 24 * 7));
}

export async function clearSessionCookies() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(REFRESH_COOKIE)?.value ?? null;
}

export async function refreshSessionIfNeeded(): Promise<string | null> {
  const access = await getAccessToken();
  if (access) return access;

  const refresh = await getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await authApi.refresh(refresh);
    const token = res.data?.token || res.token;
    const refreshToken = res.data?.refreshToken || res.refreshToken;
    if (!token || !refreshToken) return null;
    await setSessionCookies({
      token,
      refreshToken,
      user: { id: "", name: "", email: "", role: "Supporter", credits: 0, profilePicture: "", totalRaised: 0 },
    });
    return token;
  } catch {
    await clearSessionCookies();
    return null;
  }
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

export { pickAuthPayload };
