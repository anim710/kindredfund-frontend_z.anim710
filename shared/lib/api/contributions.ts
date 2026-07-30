import { apiFetch } from "./client";
import type { Contribution, Pagination } from "@/shared/types";

export const contributionsApi = {
  create: (
    token: string,
    campaignId: string,
    body: { amount: number; message?: string }
  ) =>
    apiFetch<{ success: boolean; contribution: Contribution }>(
      `/contributions/campaign/${campaignId}`,
      { method: "POST", token, body: JSON.stringify(body) }
    ),

  mine: (token: string, page = 1, limit = 10) =>
    apiFetch<{
      success: boolean;
      contributions: Contribution[];
      pagination: Pagination;
    }>("/contributions/my", { token, searchParams: { page, limit } }),

  pending: (token: string) =>
    apiFetch<{ success: boolean; contributions: Contribution[] }>(
      "/contributions/pending",
      { token }
    ),

  approve: (token: string, id: string) =>
    apiFetch<{ success: boolean; contribution: Contribution }>(
      `/contributions/${id}/approve`,
      { method: "PUT", token }
    ),

  reject: (token: string, id: string) =>
    apiFetch<{ success: boolean; contribution: Contribution }>(
      `/contributions/${id}/reject`,
      { method: "PUT", token }
    ),
};
