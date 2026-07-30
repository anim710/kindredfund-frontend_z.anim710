import { NextRequest, NextResponse } from "next/server";
import { authApi, pickAuthPayload } from "@/shared/lib/api/auth";
import { setSessionCookies, jsonError } from "@/shared/lib/auth/session";
import { ApiError } from "@/shared/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await authApi.login(body);
    const payload = pickAuthPayload(res);
    await setSessionCookies(payload);
    return NextResponse.json({ success: true, user: payload.user });
  } catch (error) {
    if (error instanceof ApiError) return jsonError(error.message, error.status);
    return jsonError("Login failed", 500);
  }
}
