"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/AuthProvider";
import { Button } from "@/shared/ui";
import { formatCredits } from "@/shared/lib/format";
import { NotificationBell } from "@/modules/notifications/NotificationBell";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const links = [
    { href: "/campaigns", label: "Campaigns" },
    ...(user
      ? [{ href: "/dashboard", label: "Dashboard" }]
      : [
          { href: "/login", label: "Log in" },
          { href: "/register", label: "Join" },
        ]),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)]/70 bg-[var(--mist)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ink)]"
        >
          Kindred<span className="text-[var(--accent)]">Fund</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium text-[var(--ink-muted)]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link hidden sm:inline"
              data-active={pathname.startsWith(link.href)}
            >
              {link.label}
            </Link>
          ))}

          {!loading && user ? (
            <div className="flex items-center gap-3">
              <span className="hidden rounded-md bg-[var(--surface-2)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)] md:inline">
                {formatCredits(user.credits)}
              </span>
              <NotificationBell />
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  await logout();
                  router.push("/");
                  router.refresh();
                }}
              >
                Log out
              </Button>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-[var(--ink-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
          KindredFund
        </p>
        <p>Community crowdfunding with credits — 20 credits = $1.</p>
      </div>
    </footer>
  );
}
