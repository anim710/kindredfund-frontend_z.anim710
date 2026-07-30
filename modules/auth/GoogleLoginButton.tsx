"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { useAuth } from "@/modules/auth/AuthProvider";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export function GoogleLoginButton() {
  const router = useRouter();
  const { setUser, refresh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          setError(null);
          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: response.credential }),
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.message || "Google sign-in failed");
            return;
          }
          setUser(data.user);
          await refresh();
          router.push("/dashboard");
          router.refresh();
        },
      });
      const el = document.getElementById("google-btn");
      if (el) {
        window.google?.accounts.id.renderButton(el, {
          theme: "outline",
          size: "large",
          width: 320,
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [clientId, refresh, router, setUser]);

  if (!clientId) {
    return (
      <p className="text-center text-xs text-[var(--ink-faint)]">
        Google sign-in available when NEXT_PUBLIC_GOOGLE_CLIENT_ID is set.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--line)]" />
        <span className="text-xs uppercase tracking-wide text-[var(--ink-faint)]">or</span>
        <div className="h-px flex-1 bg-[var(--line)]" />
      </div>
      <div id="google-btn" className="flex justify-center" />
      {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
      <Button type="button" variant="ghost" className="hidden" />
    </div>
  );
}
