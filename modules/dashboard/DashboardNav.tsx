"use client";

import Link from "next/link";
import { useAuth } from "@/modules/auth/AuthProvider";
import { cn } from "@/shared/lib/format";
import { usePathname } from "next/navigation";

export function DashboardNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  if (!user) return null;

  const links =
    user.role === "Admin"
      ? [
          { href: "/dashboard/admin", label: "Overview" },
          { href: "/dashboard/admin/campaigns", label: "Campaigns" },
          { href: "/dashboard/admin/users", label: "Users" },
          { href: "/dashboard/admin/withdrawals", label: "Withdrawals" },
        ]
      : user.role === "Creator"
        ? [
            { href: "/dashboard/creator", label: "Overview" },
            { href: "/dashboard/creator/campaigns/new", label: "New campaign" },
            { href: "/dashboard/creator/contributions", label: "Contributions" },
            { href: "/dashboard/creator/withdrawals", label: "Withdrawals" },
          ]
        : [
            { href: "/dashboard/supporter", label: "Overview" },
            { href: "/dashboard/supporter/contributions", label: "My contributions" },
            { href: "/dashboard/supporter/credits", label: "Buy credits" },
          ];

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
        {user.role} dashboard
      </p>
      <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition",
              pathname === link.href
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--ink-muted)] hover:bg-[var(--surface-2)]"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
