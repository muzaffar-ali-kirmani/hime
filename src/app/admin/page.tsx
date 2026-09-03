"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  TrendingUp,
  Users,
  ShoppingBag,
  Star,
  AlertCircle,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { useLocale } from "@/lib/locale-provider";
import { formatPrice } from "@/lib/locale";
import { cn } from "@/lib/utils";

interface Stats {
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    inProduction: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    revenue7d: number;
    revenue30d: number;
    revenueTotal: number;
  };
  users: { total: number; new7d: number };
  products: { total: number; active: number; outOfStock: number };
  reviews: { total: number; pending: number };
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  const { currency, language } = useLocale();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/stats", { credentials: "include" });
        const data = await res.json();
        if (res.ok) setStats(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-sm text-navy/60">Loading dashboard…</p>;
  }

  if (!stats) {
    return (
      <p className="text-sm text-navy/60">Could not load dashboard data.</p>
    );
  }

  const statusList = [
    { id: "pending", label: "Pending", value: stats.orders.pending, color: "bg-gold" },
    { id: "confirmed", label: "Confirmed", value: stats.orders.confirmed, color: "bg-navy" },
    { id: "in_production", label: "In production", value: stats.orders.inProduction, color: "bg-navy/70" },
    { id: "shipped", label: "Shipped", value: stats.orders.shipped, color: "bg-success" },
    { id: "delivered", label: "Delivered", value: stats.orders.delivered, color: "bg-success/70" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-navy sm:text-4xl">Dashboard</h1>
        <p className="mt-1 text-sm text-navy/60">
          Overview of your store's performance.
        </p>
      </div>

      {/* Primary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Revenue (7d)"
          value={formatPrice(stats.orders.revenue7d || 0, currency, language)}
          accent
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders (7d)"
          value={String(stats.orders.total)}
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={String(stats.users.total)}
          hint={`+${stats.users.new7d} this week`}
        />
        <StatCard
          icon={Package}
          label="Products"
          value={String(stats.products.active)}
          hint={`${stats.products.outOfStock} out of stock`}
          alert={stats.products.outOfStock > 0}
        />
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat
          label="Pending orders"
          value={stats.orders.pending}
          href="/admin/orders?status=pending"
          alert={stats.orders.pending > 0}
        />
        <MiniStat
          label="Awaiting production"
          value={stats.orders.inProduction}
          href="/admin/orders?status=in_production"
        />
        <MiniStat
          label="Ready to ship"
          value={stats.orders.shipped}
          href="/admin/orders?status=shipped"
        />
        <MiniStat
          label="Pending reviews"
          value={stats.reviews.pending}
          href="/admin/reviews"
        />
      </div>

      {/* Order status distribution */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-navy">Order status</h2>
          <div className="mt-5 space-y-3">
            {statusList.map((s) => {
              const pct = stats.orders.total
                ? Math.round((s.value / stats.orders.total) * 100)
                : 0;
              return (
                <div key={s.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-navy/80">{s.label}</span>
                    <span className="font-medium text-navy">
                      {s.value} · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn("h-full transition-all", s.color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-navy">Top selling products</h2>
            <Link
              href="/admin/products"
              className="text-xs text-gold hover:underline"
            >
              All products →
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {stats.topProducts.length === 0 && (
              <li className="text-sm text-navy/60">No sales yet.</li>
            )}
            {stats.topProducts.map((p: any, i: number) => (
              <li
                key={p.productId || i}
                className="flex items-center gap-3 rounded-lg bg-cream/40 p-2"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-gold/20 text-xs font-medium text-navy">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-navy">
                    {p.productName}
                  </p>
                  <p className="text-[10px] text-navy/55">
                    {p.sold} sold · {formatPrice(p.revenue || 0, currency, language)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-navy">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs text-gold hover:underline"
          >
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-navy/60">No orders yet.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-left text-[10px] uppercase tracking-widest text-navy/60">
                <tr>
                  <th className="px-4 py-2.5">Order</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5">Total</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-4 py-2.5 font-mono text-xs">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-2.5 text-navy/70">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5 text-navy/70">
                      {o.shippingName}
                    </td>
                    <td className="px-4 py-2.5 text-navy">
                      {formatPrice(o.totalUsd, currency, language)}
                    </td>
                    <td className="px-4 py-2.5">
                      <OrderStatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  alert,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  hint?: string;
  alert?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5",
        accent ? "border-gold" : "border-border"
      )}
    >
      <div className="flex items-start justify-between">
        <Icon
          className={cn(
            "size-5",
            alert ? "text-destructive" : "text-gold"
          )}
          strokeWidth={1.5}
        />
        {alert && <AlertCircle className="size-4 text-destructive" />}
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-widest text-navy/60">
        {label}
      </p>
      <p className="mt-1 font-serif text-2xl text-navy sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-[10px] text-navy/55">{hint}</p>}
    </div>
  );
}

function MiniStat({
  label,
  value,
  href,
  alert,
}: {
  label: string;
  value: number;
  href: string;
  alert?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
    >
      <div>
        <p className="text-[10px] uppercase tracking-widest text-navy/60">
          {label}
        </p>
        <p
          className={cn(
            "mt-1 font-serif text-2xl",
            alert ? "text-destructive" : "text-navy"
          )}
        >
          {value}
        </p>
      </div>
      <ArrowRight className="size-4 text-navy/40" />
    </Link>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-gold/20 text-navy",
    confirmed: "bg-navy/10 text-navy",
    in_production: "bg-navy/20 text-navy",
    shipped: "bg-success/20 text-success",
    delivered: "bg-success/30 text-success",
    cancelled: "bg-destructive/15 text-destructive",
    returned: "bg-secondary text-navy/60",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest",
        colors[status] || "bg-secondary text-navy/70"
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}