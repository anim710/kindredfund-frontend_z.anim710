"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/shared/lib/api/browser";
import { EmptyState } from "@/shared/ui";
import { formatCredits, formatDate } from "@/shared/lib/format";
import type { Contribution } from "@/shared/types";

export default function MyContributionsPage() {
  const [items, setItems] = useState<Contribution[]>([]);

  useEffect(() => {
    clientApi
      .get<{ contributions: Contribution[] }>("/contributions/my?limit=50")
      .then((res) => setItems(res.contributions || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">My contributions</h1>
      {items.length === 0 ? (
        <EmptyState title="Nothing here yet" />
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c._id} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
              <p className="font-medium">{c.campaignTitle}</p>
              <p className="text-sm text-[var(--ink-muted)]">
                {formatCredits(c.amount)} · {c.status} · {formatDate(c.date)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
