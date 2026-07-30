import Link from "next/link";
import Image from "next/image";
import { campaignsApi } from "@/shared/lib/api/campaigns";
import { CampaignCard } from "@/modules/campaigns/CampaignCard";
import { Button } from "@/shared/ui";
import type { Campaign } from "@/shared/types";

export default async function HomePage() {
  let top: Campaign[] = [];
  try {
    const res = await campaignsApi.topFunded(6);
    top = res.campaigns || [];
  } catch {
    top = [];
  }

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&q=80"
          alt="People gathering around a shared cause"
          fill
          priority
          className="object-cover"
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-overlay)" }}
        />
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6">
          <p className="animate-fade font-[family-name:var(--font-display)] text-5xl text-white sm:text-7xl md:text-8xl">
            KindredFund
          </p>
          <h1 className="animate-rise mt-4 max-w-xl text-2xl font-medium text-white/95 sm:text-3xl">
            Fund what your community believes in.
          </h1>
          <p className="animate-rise mt-3 max-w-lg text-base text-white/80 [animation-delay:120ms]">
            Contribute with credits, back local creators, and watch ideas take root.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3 [animation-delay:200ms]">
            <Link href="/campaigns">
              <Button size="lg">Explore campaigns</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Join KindredFund
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
              Top funded now
            </h2>
            <p className="mt-1 text-[var(--ink-muted)]">
              Campaigns gathering the strongest support this season.
            </p>
          </div>
          <Link href="/campaigns" className="text-sm font-medium text-[var(--accent)] hover:underline">
            View all
          </Link>
        </div>
        {top.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-12 text-center text-[var(--ink-muted)]">
            No live campaigns yet. Start the backend and seed data to see them here.
          </p>
        ) : (
          <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((c) => (
              <CampaignCard key={c._id} campaign={c} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
