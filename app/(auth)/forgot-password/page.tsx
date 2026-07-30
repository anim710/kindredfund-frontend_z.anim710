"use client";

import { useState } from "react";
import { Button, Input } from "@/shared/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Reset password</h1>
      <p className="mt-2 text-[var(--ink-muted)]">
        We&apos;ll email a reset link if that account exists.
      </p>
      <form
        className="mt-8 space-y-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setMessage(null);
          try {
            const res = await fetch("/api/proxy/auth/forgot-password", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            const data = await res.json();
            setMessage(data.message || "If an account exists, a reset email was sent.");
          } catch {
            setMessage("Something went wrong. Try again.");
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </div>
  );
}
