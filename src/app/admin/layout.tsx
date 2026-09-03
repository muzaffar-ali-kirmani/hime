"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  FileEdit,
  LogOut,
  ExternalLink,
  Settings,
} from "lucide-react";
import { useStore } from "@/lib/store-provider";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/content", label: "Homepage", icon: FileEdit },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, userLoading, refreshUser } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (userLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!user?.email.endsWith("@hime.jewellery")) {
      setAuthorized(false);
      return;
    }
    setAuthorized(true);
  }, [userLoading, isAuthenticated, user, router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refreshUser();
    router.push("/");
  }

  if (authorized === null || userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-navy/60">Loading admin…</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-6">
        <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center">
          <h1 className="font-serif text-3xl text-navy">Admin access required</h1>
          <p className="mt-2 text-sm text-navy/60">
            You're signed in as {user?.email}, but this account doesn't have
            admin privileges. Use an account with an @{`hime.jewellery`} email.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link
              href="/"
              className="rounded-full border border-border bg-card px-5 py-2 text-sm text-navy hover:border-navy"
            >
              Back to store
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-full bg-navy px-5 py-2 text-sm text-cream hover:bg-navy/90"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="border-b border-border p-5">
          <Link href="/" className="block">
            <span className="font-serif text-2xl text-navy">Hime</span>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-gold">
              Admin
            </p>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-navy text-cream"
                    : "text-navy/80 hover:bg-navy/5"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy/70 hover:bg-navy/5"
          >
            <ExternalLink className="size-4" /> View store
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy/70 hover:bg-navy/5"
          >
            <LogOut className="size-4" /> Sign out
          </button>
          <p className="mt-3 px-3 text-[10px] text-navy/50">{user?.email}</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-cream/90 px-5 py-3 backdrop-blur lg:hidden">
          <Link href="/admin" className="font-serif text-xl text-navy">
            Hime Admin
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-navy/60 hover:text-navy"
          >
            Sign out
          </button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs",
                  active ? "bg-navy text-cream" : "text-navy/70"
                )}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}