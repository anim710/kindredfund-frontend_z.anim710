"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApi } from "@/shared/lib/api/browser";
import { useAuth } from "@/modules/auth/AuthProvider";
import type { Notification } from "@/shared/types";

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const [listRes, countRes] = await Promise.all([
          clientApi.get<{ notifications: Notification[] }>("/notifications"),
          clientApi.get<{ count: number }>("/notifications/unread-count"),
        ]);
        if (!cancelled) {
          setItems(listRes.notifications?.slice(0, 6) || []);
          setCount(countRes.count || 0);
        }
      } catch {
        /* ignore when offline */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        className="relative rounded-md p-2 text-[var(--ink-muted)] hover:bg-[var(--surface-2)]"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {count > 0 ? (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">Notifications</p>
            <button
              type="button"
              className="text-xs text-[var(--accent)]"
              onClick={async () => {
                await clientApi.put("/notifications/mark-all-read");
                setCount(0);
                setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
              }}
            >
              Mark all read
            </button>
          </div>
          <ul className="max-h-72 space-y-2 overflow-auto">
            {items.length === 0 ? (
              <li className="py-6 text-center text-sm text-[var(--ink-faint)]">
                You&apos;re all caught up
              </li>
            ) : (
              items.map((n) => (
                <li
                  key={n._id}
                  className={`rounded-md px-2 py-2 text-sm ${n.isRead ? "opacity-70" : "bg-[var(--surface-2)]"}`}
                >
                  <Link href={n.actionRoute || "/dashboard"} onClick={() => setOpen(false)}>
                    {n.message}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
