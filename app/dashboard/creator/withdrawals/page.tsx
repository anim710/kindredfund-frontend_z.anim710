"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientApi } from "@/shared/lib/api/browser";
import { Button, EmptyState, Input, Select } from "@/shared/ui";
import { formatCredits, formatMoney } from "@/shared/lib/format";
import type { Withdrawal } from "@/shared/types";
import { useAuth } from "@/modules/auth/AuthProvider";

const schema = z.object({
  credits: z
    .string()
    .min(1)
    .transform(Number)
    .pipe(z.number().min(200).refine((n) => n % 20 === 0, "Must be multiples of 20")),
  paymentSystem: z.enum(["Bkash", "Rocket", "Nagad", "Stripe", "Other"]),
  accountNumber: z.string().min(5).max(30),
});

type FormValues = z.input<typeof schema>;
type SubmitValues = z.output<typeof schema>;

export default function CreatorWithdrawalsPage() {
  const { refresh } = useAuth();
  const [items, setItems] = useState<Withdrawal[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, SubmitValues>({
    resolver: zodResolver(schema),
    defaultValues: { paymentSystem: "Bkash", credits: "200" },
  });

  async function load() {
    const res = await clientApi.get<{ withdrawals: Withdrawal[] }>("/withdrawals/my");
    setItems(res.withdrawals || []);
  }

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);
    try {
      await clientApi.post("/withdrawals", values);
      reset({ paymentSystem: "Bkash", credits: "200", accountNumber: "" });
      await refresh();
      await load();
      setMessage("Withdrawal requested.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Request failed");
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Withdrawals</h1>
        <p className="mt-1 text-[var(--ink-muted)]">Minimum 200 credits ($10), multiples of 20.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <Input label="Credits" type="number" step={20} error={errors.credits?.message} {...register("credits")} />
        <Select
          label="Payment system"
          options={["Bkash", "Rocket", "Nagad", "Stripe", "Other"].map((v) => ({ value: v, label: v }))}
          {...register("paymentSystem")}
        />
        <Input label="Account number" error={errors.accountNumber?.message} {...register("accountNumber")} />
        {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          Request withdrawal
        </Button>
      </form>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-2xl">History</h2>
        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <EmptyState title="No withdrawals yet" />
          ) : (
            items.map((w) => (
              <div key={w._id} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm">
                <p className="font-medium">
                  {formatCredits(w.credits)} · {formatMoney(w.amount)} · {w.status}
                </p>
                <p className="text-[var(--ink-muted)]">{w.paymentSystem} · {w.accountNumber}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
