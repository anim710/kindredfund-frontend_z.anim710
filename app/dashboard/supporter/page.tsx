"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/modules/auth/AuthProvider";
import { clientApi } from "@/shared/lib/api/browser";
import { Button, EmptyState } from "@/shared/ui";
import { formatCredits } from "@/shared/lib/format";
import type { Contribution } from "@/shared/types";

export default function SupporterDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [recent, setRecent] = useState<Contribution[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [dash, mine] = await Promise.all([
          clientApi.get<{ stats: Record<string, unknown> }>("/dashboard"),
          clientApi.get<{ contributions: Contribution[] }>("/contributions/my?limit=5"),
        ]);
        setStats(dash.stats || null);
        setRecent(mine.contributions || []);
      } catch {
        /* backend may be down */
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Hello, {user?.name}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">
          Balance {formatCredits(user?.credits || 0)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Credits", value: formatCredits(user?.credits || 0) },
          { label: "Contributions", value: String((stats as { totalContributions?: number })?.totalContributions ?? recent.length) },
          { label: "Role", value: user?.role || "—" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--ink-faint)]">{item.label}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/supporter/credits">
          <Button>Buy credits</Button>
        </Link>
        <Link href="/campaigns">
          <Button variant="secondary">Browse campaigns</Button>
        </Link>
      </div>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Recent contributions</h2>
        <div className="mt-4 space-y-3">
          {recent.length === 0 ? (
            <EmptyState title="No contributions yet" description="Find a campaign and make your first pledge." />
          ) : (
            recent.map((c) => (
              <div key={c._id} className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{c.campaignTitle}</p>
                  <p className="text-[var(--ink-muted)]">{formatCredits(c.amount)} · {c.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
