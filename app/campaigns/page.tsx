import { Suspense } from "react";
import { campaignsApi } from "@/shared/lib/api/campaigns";
import { CampaignCard } from "@/modules/campaigns/CampaignCard";
import { CampaignFilters } from "@/modules/campaigns/CampaignFilters";
import { EmptyState } from "@/shared/ui";
import type { Campaign, Pagination } from "@/shared/types";

export const metadata = { title: "Campaigns" };

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  let campaigns: Campaign[] = [];
  let pagination: Pagination = { page: 1, pages: 1, total: 0, limit: 12 };

  try {
    const res = await campaignsApi.list({
      category: params.category,
      search: params.search,
      page: Number(params.page || 1),
      limit: 12,
    });
    campaigns = res.campaigns || [];
    pagination = res.pagination || pagination;
  } catch {
    campaigns = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Campaigns</h1>
      <p className="mt-2 text-[var(--ink-muted)]">
        Browse approved campaigns and put your credits to work.
      </p>
      <div className="mt-6">
        <Suspense fallback={null}>
          <CampaignFilters />
        </Suspense>
      </div>
      <div className="mt-8">
        {campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns found"
            description="Try another category or start the API with seed data."
          />
        ) : (
          <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c._id} campaign={c} />
            ))}
          </div>
        )}
      </div>
      {pagination.pages > 1 ? (
        <p className="mt-8 text-center text-sm text-[var(--ink-muted)]">
          Page {pagination.page} of {pagination.pages} · {pagination.total} campaigns
        </p>
      ) : null}
    </div>
  );
}
