"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/AuthProvider";
import { Button, Input, TextArea } from "@/shared/ui";
import { clientApi } from "@/shared/lib/api/browser";
import { formatCredits } from "@/shared/lib/format";

export function ContributeForm({
  campaignId,
  minimumContribution,
}: {
  campaignId: string;
  minimumContribution: number;
}) {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState(minimumContribution);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="text-sm text-[var(--ink-muted)]">
          Sign in to contribute credits to this campaign.
        </p>
        <Button className="mt-3" onClick={() => router.push(`/login?next=/campaigns/${campaignId}`)}>
          Sign in to contribute
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
          await clientApi.post(`/contributions/campaign/${campaignId}`, {
            amount: Number(amount),
            message: message || undefined,
          });
          setSuccess("Contribution submitted — waiting for creator approval.");
          await refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Contribution failed");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-xl">Contribute</h3>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Balance: {formatCredits(user.credits)} · Min {minimumContribution}
        </p>
      </div>
      <Input
        label="Credits"
        type="number"
        min={minimumContribution}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <TextArea
        label="Message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending…" : "Pledge credits"}
      </Button>
    </form>
  );
}
