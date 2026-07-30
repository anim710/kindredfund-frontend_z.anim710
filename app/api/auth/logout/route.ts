import { NextResponse } from "next/server";
import { authApi } from "@/shared/lib/api/auth";
import { clearSessionCookies, getAccessToken } from "@/shared/lib/auth/session";

export async function POST() {
  try {
    const token = await getAccessToken();
    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        /* ignore */
      }
    }
  } finally {
    await clearSessionCookies();
  }
  return NextResponse.json({ success: true });
}
