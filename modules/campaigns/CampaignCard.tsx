import Link from "next/link";
import Image from "next/image";
import type { Campaign } from "@/shared/types";
import { Badge, Progress } from "@/shared/ui";
import {
  daysRemaining,
  formatCredits,
  progressPercent,
} from "@/shared/lib/format";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const pct = progressPercent(campaign.amountRaised, campaign.fundingGoal);

  return (
    <Link
      href={`/campaigns/${campaign._id}`}
      className="group block overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-2)]">
        <Image
          src={campaign.imageUrl || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800"}
          alt={campaign.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
          unoptimized
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-[family-name:var(--font-display)] text-lg leading-snug text-[var(--ink)]">
            {campaign.title}
          </h3>
          <Badge tone="accent">{campaign.category}</Badge>
        </div>
        <Progress value={pct} />
        <div className="flex items-center justify-between text-sm text-[var(--ink-muted)]">
          <span>{formatCredits(campaign.amountRaised)} raised</span>
          <span>{daysRemaining(campaign.deadline)}d left</span>
        </div>
      </div>
    </Link>
  );
}
