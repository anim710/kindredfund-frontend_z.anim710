import { NextResponse } from "next/server";
import { authApi } from "@/shared/lib/api/auth";
import {
  jsonError,
  refreshSessionIfNeeded,
} from "@/shared/lib/auth/session";
import { ApiError } from "@/shared/lib/api/client";

export async function GET() {
  try {
    const token = await refreshSessionIfNeeded();
    if (!token) return jsonError("Not authenticated", 401);
    const res = await authApi.me(token);
    const user = res.data?.user || res.user;
    return NextResponse.json({ success: true, user });
  } catch (error) {
    if (error instanceof ApiError) return jsonError(error.message, error.status);
    return jsonError("Failed to load session", 500);
  }
}
