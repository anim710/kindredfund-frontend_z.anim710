"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/modules/auth/AuthProvider";
import { clientApi } from "@/shared/lib/api/browser";
import { Button } from "@/shared/ui";
import { formatCredits } from "@/shared/lib/format";
import type { Contribution } from "@/shared/types";

export default function CreatorDashboardPage() {
  const { user } = useAuth();
  const [pending, setPending] = useState<Contribution[]>([]);

  useEffect(() => {
    clientApi
      .get<{ contributions: Contribution[] }>("/contributions/pending")
      .then((res) => setPending(res.contributions || []))
      .catch(() => setPending([]));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">Creator home</h1>
          <p className="mt-1 text-[var(--ink-muted)]">
            {formatCredits(user?.credits || 0)} available · {formatCredits(user?.totalRaised || 0)} raised lifetime
          </p>
        </div>
        <Link href="/dashboard/creator/campaigns/new">
          <Button>New campaign</Button>
        </Link>
      </div>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Pending contributions ({pending.length})
        </h2>
        <ul className="mt-4 space-y-3">
          {pending.length === 0 ? (
            <li className="text-sm text-[var(--ink-muted)]">No pending pledges.</li>
          ) : (
            pending.slice(0, 5).map((c) => (
              <li key={c._id} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm">
                <p className="font-medium">{c.supporterName} → {c.campaignTitle}</p>
                <p className="text-[var(--ink-muted)]">{formatCredits(c.amount)}</p>
              </li>
            ))
          )}
        </ul>
        <Link href="/dashboard/creator/contributions" className="mt-3 inline-block text-sm text-[var(--accent)] hover:underline">
          Manage all
        </Link>
      </section>
    </div>
  );
}
