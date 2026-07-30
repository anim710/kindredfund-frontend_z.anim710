"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/AuthProvider";

export default function DashboardIndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    if (user.role === "Admin") router.replace("/dashboard/admin");
    else if (user.role === "Creator") router.replace("/dashboard/creator");
    else router.replace("/dashboard/supporter");
  }, [user, loading, router]);

  return <p className="text-[var(--ink-muted)]">Redirecting…</p>;
}
