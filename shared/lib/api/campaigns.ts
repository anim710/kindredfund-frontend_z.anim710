import { apiFetch } from "./client";
import type { Campaign, Pagination } from "@/shared/types";

export const campaignsApi = {
  list: (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    apiFetch<{
      success: boolean;
      campaigns: Campaign[];
      pagination: Pagination;
    }>("/campaigns", { searchParams: params }),

  topFunded: (limit = 6) =>
    apiFetch<{ success: boolean; campaigns: Campaign[] }>(
      "/campaigns/top-funded",
      { searchParams: { limit } }
    ),

  get: (id: string) =>
    apiFetch<{
      success: boolean;
      campaign: Campaign;
      stats?: {
        contributorCount: number;
        hasContributed: boolean;
        percentageRaised: number;
      };
    }>(`/campaigns/${id}`),

  create: (
    token: string,
    body: {
      title: string;
      story: string;
      category: string;
      fundingGoal: number;
      minimumContribution: number;
      deadline: string;
      rewardInfo: string;
      imageUrl: string;
    }
  ) =>
    apiFetch<{ success: boolean; campaign: Campaign; message: string }>(
      "/campaigns",
      { method: "POST", token, body: JSON.stringify(body) }
    ),

  updateStatus: (
    token: string,
    id: string,
    body: { status: string; reason?: string }
  ) =>
    apiFetch<{ success: boolean; campaign: Campaign }>(
      `/campaigns/${id}/status`,
      { method: "PUT", token, body: JSON.stringify(body) }
    ),

  report: (token: string, id: string, reason: string) =>
    apiFetch<{ success: boolean }>(`/campaigns/${id}/report`, {
      method: "POST",
      token,
      body: JSON.stringify({ reason }),
    }),
};
