"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/shared/lib/api/browser";
import { useAuth } from "@/modules/auth/AuthProvider";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    clientApi
      .get<{ stats: Record<string, unknown> }>("/dashboard")
      .then((res) => setStats(res.stats || null))
      .catch(() => setStats(null));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Admin overview</h1>
        <p className="mt-1 text-[var(--ink-muted)]">Signed in as {user?.email}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(stats || { users: "—", campaigns: "—", pending: "—" }).map(([key, value]) => (
          <div key={key} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--ink-faint)]">{key}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">
              {typeof value === "object" ? JSON.stringify(value) : String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
