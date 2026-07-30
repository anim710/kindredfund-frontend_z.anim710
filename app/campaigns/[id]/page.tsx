import Image from "next/image";
import { notFound } from "next/navigation";
import { campaignsApi } from "@/shared/lib/api/campaigns";
import { ContributeForm } from "@/modules/contributions/ContributeForm";
import { Badge, Progress } from "@/shared/ui";
import {
  daysRemaining,
  formatCredits,
  formatDate,
  progressPercent,
} from "@/shared/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const res = await campaignsApi.get(id);
    return { title: res.campaign.title };
  } catch {
    return { title: "Campaign" };
  }
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let campaign;
  try {
    const res = await campaignsApi.get(id);
    campaign = res.campaign;
  } catch {
    notFound();
  }

  const pct = progressPercent(campaign.amountRaised, campaign.fundingGoal);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1.4fr_0.8fr] sm:px-6">
      <article>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[var(--surface-2)]">
          <Image
            src={campaign.imageUrl || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200"}
            alt={campaign.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge tone="accent">{campaign.category}</Badge>
          <Badge>{campaign.status}</Badge>
          <span className="text-sm text-[var(--ink-muted)]">
            by {campaign.creatorName}
          </span>
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
          {campaign.title}
        </h1>
        <div className="mt-6 space-y-3">
          <Progress value={pct} />
          <div className="flex flex-wrap gap-4 text-sm text-[var(--ink-muted)]">
            <span>{formatCredits(campaign.amountRaised)} of {formatCredits(campaign.fundingGoal)}</span>
            <span>{campaign.supporterCount} supporters</span>
            <span>{daysRemaining(campaign.deadline)} days left · ends {formatDate(campaign.deadline)}</span>
          </div>
        </div>
        <div className="prose mt-8 max-w-none whitespace-pre-wrap text-[var(--ink-muted)]">
          {campaign.story}
        </div>
        <div className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Rewards</h2>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{campaign.rewardInfo}</p>
        </div>
      </article>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <ContributeForm
          campaignId={campaign._id}
          minimumContribution={campaign.minimumContribution}
        />
      </aside>
    </div>
  );
}
