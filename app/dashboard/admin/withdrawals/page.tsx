"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/shared/lib/api/browser";
import { Button, EmptyState } from "@/shared/ui";
import { formatCredits, formatMoney } from "@/shared/lib/format";
import type { Withdrawal } from "@/shared/types";

export default function AdminWithdrawalsPage() {
  const [items, setItems] = useState<Withdrawal[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await clientApi.get<{ withdrawals: Withdrawal[] }>("/withdrawals/pending");
    setItems(res.withdrawals || []);
  }

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Withdrawal queue</h1>
      {items.length === 0 ? (
        <EmptyState title="No pending withdrawals" />
      ) : (
        <ul className="space-y-3">
          {items.map((w) => (
            <li key={w._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
              <div>
                <p className="font-medium">{w.creatorName}</p>
                <p className="text-sm text-[var(--ink-muted)]">
                  {formatCredits(w.credits)} · {formatMoney(w.amount)} · {w.paymentSystem} · {w.accountNumber}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={busy === w._id}
                  onClick={async () => {
                    setBusy(w._id);
                    try {
                      await clientApi.put(`/withdrawals/${w._id}/approve`, {});
                      await load();
                    } finally {
                      setBusy(null);
                    }
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={busy === w._id}
                  onClick={async () => {
                    setBusy(w._id);
                    try {
                      await clientApi.put(`/withdrawals/${w._id}/reject`, { reason: "Rejected by admin" });
                      await load();
                    } finally {
                      setBusy(null);
                    }
                  }}
                >
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
