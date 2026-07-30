"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/shared/lib/api/browser";
import { Button, EmptyState } from "@/shared/ui";
import { formatCredits } from "@/shared/lib/format";
import type { Contribution } from "@/shared/types";

export default function CreatorContributionsPage() {
  const [items, setItems] = useState<Contribution[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await clientApi.get<{ contributions: Contribution[] }>("/contributions/pending");
    setItems(res.contributions || []);
  }

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  async function act(id: string, action: "approve" | "reject") {
    setBusy(id);
    try {
      await clientApi.put(`/contributions/${id}/${action}`);
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Pending contributions</h1>
      {items.length === 0 ? (
        <EmptyState title="Queue is clear" />
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
              <div>
                <p className="font-medium">{c.supporterName}</p>
                <p className="text-sm text-[var(--ink-muted)]">
                  {formatCredits(c.amount)} for {c.campaignTitle}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" disabled={busy === c._id} onClick={() => act(c._id, "approve")}>
                  Approve
                </Button>
                <Button size="sm" variant="secondary" disabled={busy === c._id} onClick={() => act(c._id, "reject")}>
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
