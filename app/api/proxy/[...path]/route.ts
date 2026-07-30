import { NextRequest, NextResponse } from "next/server";
import { API_URL, ACCESS_COOKIE, REFRESH_COOKIE, cookieOptions } from "@/shared/lib/auth/cookies";
import { cookies } from "next/headers";
import { authApi } from "@/shared/lib/api/auth";

async function getToken(): Promise<string | null> {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (access) return access;

  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!refresh) return null;

  try {
    const res = await authApi.refresh(refresh);
    const token = res.data?.token || res.token;
    const refreshToken = res.data?.refreshToken || res.refreshToken;
    if (!token || !refreshToken) return null;
    jar.set(ACCESS_COOKIE, token, cookieOptions(60 * 15));
    jar.set(REFRESH_COOKIE, refreshToken, cookieOptions(60 * 60 * 24 * 7));
    return token;
  } catch {
    return null;
  }
}

async function proxy(req: NextRequest, pathParts: string[]) {
  const path = "/" + pathParts.join("/");
  const url = new URL(`${API_URL}${path}`);
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const token = await getToken();
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  const upstream = await fetch(url.toString(), init);
  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json" },
  });
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
