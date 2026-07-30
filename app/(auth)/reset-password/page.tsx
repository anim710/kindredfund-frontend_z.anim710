"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button, Input } from "@/shared/ui";

function ResetForm() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="mt-8 space-y-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        const res = await fetch("/api/proxy/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
          setError(data.message || "Reset failed");
          return;
        }
        setMessage("Password updated. You can sign in now.");
        setTimeout(() => router.push("/login"), 1200);
      }}
    >
      <Input
        label="New password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      <Button type="submit" className="w-full" disabled={loading || !token}>
        {loading ? "Saving…" : "Update password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Choose a new password</h1>
      <Suspense fallback={<p className="mt-8">Loading…</p>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}
