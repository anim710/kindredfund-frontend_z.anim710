import { apiFetch } from "./client";
import type { Notification, Payment, Withdrawal } from "@/shared/types";

export const paymentsApi = {
  packages: () =>
    apiFetch<{
      success: boolean;
      packages: Array<{
        id: string;
        credits: number;
        price: number;
        pricePerCredit: string;
      }>;
    }>("/payments/packages"),

  createIntent: (token: string, packageId: string) =>
    apiFetch<{
      success: boolean;
      clientSecret: string;
      paymentId: string;
      amount: number;
      credits: number;
    }>("/payments/create-intent", {
      method: "POST",
      token,
      body: JSON.stringify({ package: packageId }),
    }),

  confirm: (token: string, paymentIntentId: string) =>
    apiFetch<{ success: boolean; message: string; credits: number }>(
      "/payments/confirm",
      {
        method: "POST",
        token,
        body: JSON.stringify({ paymentIntentId }),
      }
    ),

  history: (token: string) =>
    apiFetch<{ success: boolean; payments: Payment[] }>("/payments/history", {
      token,
    }),
};

export const withdrawalsApi = {
  request: (
    token: string,
    body: { credits: number; paymentSystem: string; accountNumber: string }
  ) =>
    apiFetch<{ success: boolean; withdrawal: Withdrawal }>("/withdrawals", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),

  mine: (token: string) =>
    apiFetch<{ success: boolean; withdrawals: Withdrawal[] }>(
      "/withdrawals/my",
      { token }
    ),

  pending: (token: string) =>
    apiFetch<{ success: boolean; withdrawals: Withdrawal[] }>(
      "/withdrawals/pending",
      { token }
    ),

  approve: (token: string, id: string, transactionId?: string) =>
    apiFetch<{ success: boolean }>(`/withdrawals/${id}/approve`, {
      method: "PUT",
      token,
      body: JSON.stringify({ transactionId }),
    }),

  reject: (token: string, id: string, reason?: string) =>
    apiFetch<{ success: boolean }>(`/withdrawals/${id}/reject`, {
      method: "PUT",
      token,
      body: JSON.stringify({ reason }),
    }),
};

export const notificationsApi = {
  list: (token: string) =>
    apiFetch<{ success: boolean; notifications: Notification[] }>(
      "/notifications",
      { token }
    ),

  unreadCount: (token: string) =>
    apiFetch<{ success: boolean; count: number }>(
      "/notifications/unread-count",
      { token }
    ),

  markRead: (token: string, id: string) =>
    apiFetch<{ success: boolean }>(`/notifications/${id}/read`, {
      method: "PUT",
      token,
    }),

  markAllRead: (token: string) =>
    apiFetch<{ success: boolean }>("/notifications/mark-all-read", {
      method: "PUT",
      token,
    }),
};

export const dashboardApi = {
  byRole: (token: string) =>
    apiFetch<{ success: boolean; role: string; stats: Record<string, unknown> }>(
      "/dashboard",
      { token }
    ),
};

export const usersApi = {
  list: (token: string, page = 1) =>
    apiFetch<{
      success: boolean;
      users: Array<{
        _id: string;
        name: string;
        email: string;
        role: string;
        credits: number;
        isActive: boolean;
      }>;
      pagination?: { page: number; total: number; pages: number };
    }>("/users", { token, searchParams: { page, limit: 20 } }),

  updateStatus: (token: string, id: string, isActive: boolean) =>
    apiFetch<{ success: boolean }>(`/users/${id}/status`, {
      method: "PUT",
      token,
      body: JSON.stringify({ isActive }),
    }),

  updateRole: (token: string, id: string, role: string) =>
    apiFetch<{ success: boolean }>(`/users/${id}/role`, {
      method: "PUT",
      token,
      body: JSON.stringify({ role }),
    }),
};
