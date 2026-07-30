"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/shared/lib/api/browser";
import { Button, EmptyState } from "@/shared/ui";

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  isActive: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  async function load() {
    const res = await clientApi.get<{ users: AdminUser[] }>("/users?limit=50");
    setUsers(res.users || []);
  }

  useEffect(() => {
    load().catch(() => setUsers([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Users</h1>
      {users.length === 0 ? (
        <EmptyState title="No users loaded" description="Ensure you're signed in as Admin and the API is running." />
      ) : (
        <ul className="space-y-3">
          {users.map((u) => (
            <li key={u._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-[var(--ink-muted)]">
                  {u.email} · {u.role} · {u.credits} credits · {u.isActive ? "active" : "inactive"}
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  await clientApi.put(`/users/${u._id}/status`, { isActive: !u.isActive });
                  await load();
                }}
              >
                {u.isActive ? "Deactivate" : "Activate"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
