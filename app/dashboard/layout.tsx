"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/AuthProvider";
import { DashboardNav } from "@/modules/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/dashboard");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-[var(--ink-muted)]">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row sm:px-6">
      <DashboardNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
