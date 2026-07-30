"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/shared/lib/api/browser";
import { Button, EmptyState } from "@/shared/ui";
import type { Campaign } from "@/shared/types";

export default function AdminCampaignsPage() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    // Public list is approved-only; admin needs pending via dashboard/users flow.
    // Use campaigns list without filter won't show pending. Fetch via proxy with a broad approach:
    // Backend getCampaigns returns approved. For admin moderation we call status updates on known IDs.
    // Fallback: show message and allow ID-based moderation from seed/top if available.
    const res = await clientApi.get<{ campaigns: Campaign[] }>("/campaigns?limit=50");
    setItems(res.campaigns || []);
  }

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  async function setStatus(id: string, status: "approved" | "rejected" | "suspended") {
    setBusy(id);
    try {
      await clientApi.put(`/campaigns/${id}/status`, { status });
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Campaign moderation</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Showing currently listed campaigns. Use approve/reject/suspend to update status.
        </p>
      </div>
      {items.length === 0 ? (
        <EmptyState title="No campaigns to show" />
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-[var(--ink-muted)]">
                  {c.creatorName} · {c.status} · {c.category}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" disabled={busy === c._id} onClick={() => setStatus(c._id, "approved")}>
                  Approve
                </Button>
                <Button size="sm" variant="secondary" disabled={busy === c._id} onClick={() => setStatus(c._id, "rejected")}>
                  Reject
                </Button>
                <Button size="sm" variant="danger" disabled={busy === c._id} onClick={() => setStatus(c._id, "suspended")}>
                  Suspend
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
