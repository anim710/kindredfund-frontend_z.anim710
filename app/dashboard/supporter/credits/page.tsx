"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { clientApi } from "@/shared/lib/api/browser";
import { Button } from "@/shared/ui";
import { formatMoney } from "@/shared/lib/format";
import { useAuth } from "@/modules/auth/AuthProvider";

type Package = { id: string; credits: number; price: number; pricePerCredit: string };

function CheckoutForm({
  credits,
  onDone,
}: {
  credits: number;
  onDone: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { refresh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setLoading(true);
        setError(null);
        const result = await stripe.confirmPayment({
          elements,
          redirect: "if_required",
        });
        if (result.error) {
          setError(result.error.message || "Payment failed");
          setLoading(false);
          return;
        }
        if (result.paymentIntent?.id) {
          try {
            await clientApi.post("/payments/confirm", {
              paymentIntentId: result.paymentIntent.id,
            });
            await refresh();
            onDone();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Confirm failed");
          }
        }
        setLoading(false);
      }}
    >
      <PaymentElement />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={loading || !stripe}>
        {loading ? "Processing…" : `Pay for ${credits} credits`}
      </Button>
    </form>
  );
}

export default function BuyCreditsPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selected, setSelected] = useState<Package | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey]
  );

  useEffect(() => {
    clientApi
      .get<{ packages: Package[] }>("/payments/packages")
      .then((res) => setPackages(res.packages || []))
      .catch(() => setPackages([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Buy credits</h1>
        <p className="mt-1 text-[var(--ink-muted)]">20 credits = $1 · secure Stripe checkout</p>
      </div>

      {!publishableKey ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable checkout. Packages still list from the API.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={async () => {
              setMessage(null);
              setSelected(pkg);
              setClientSecret(null);
              try {
                const res = await clientApi.post<{ clientSecret: string }>(
                  "/payments/create-intent",
                  { package: pkg.id }
                );
                setClientSecret(res.clientSecret);
              } catch (err) {
                setMessage(err instanceof Error ? err.message : "Could not start payment");
              }
            }}
            className={`rounded-xl border px-4 py-5 text-left transition ${
              selected?.id === pkg.id
                ? "border-[var(--accent)] bg-teal-50"
                : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)]"
            }`}
          >
            <p className="font-[family-name:var(--font-display)] text-2xl">{pkg.credits} credits</p>
            <p className="mt-1 text-[var(--ink-muted)]">{formatMoney(pkg.price)}</p>
          </button>
        ))}
      </div>

      {message ? <p className="text-sm text-red-600">{message}</p> : null}

      {clientSecret && stripePromise && selected ? (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              credits={selected.credits}
              onDone={() => {
                setMessage("Credits added to your account.");
                setClientSecret(null);
                setSelected(null);
              }}
            />
          </Elements>
        </div>
      ) : null}
    </div>
  );
}
