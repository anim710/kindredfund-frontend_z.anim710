import { Suspense } from "react";
import { LoginForm } from "@/modules/auth/LoginForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
        Welcome back
      </h1>
      <p className="mt-2 text-[var(--ink-muted)]">Sign in to continue funding what matters.</p>
      <div className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
        <Suspense fallback={<p>Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
