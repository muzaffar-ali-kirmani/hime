"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, TrendingUp, Users, ShoppingBag } from "lucide-react";
import { ShopLayout } from "@/components/shop-layout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store-provider";
import { api } from "@/lib/api-client";

export default function AdminPage() {
  const { user, isAuthenticated } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0 });

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const { orders } = await fetch("/api/admin/orders", {
          credentials: "include",
        }).then((r) => r.json());
        setOrders(orders || []);
        setStats({
          total: orders.length,
          pending: orders.filter((o: any) => o.status === "pending").length,
          revenue: orders.reduce((sum: number, o: any) => sum + o.totalUsd, 0),
        });
      } catch {}
    })();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <ShopLayout>
        <section className="container-wide py-20 text-center">
          <h1 className="font-serif text-4xl text-navy">Sign in required</h1>
          <Button asChild className="mt-4">
            <Link href="/login">Sign in</Link>
          </Button>
        </section>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <section className="container-wide py-10 lg:py-14">
        <header className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-gold">Admin</p>
          <h1 className="font-serif text-4xl text-navy sm:text-5xl">Dashboard</h1>
          <p className="mt-1 text-sm text-navy/60">
            Signed in as {user?.email}
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={ShoppingBag}
            label="Total orders"
            value={String(stats.total)}
          />
          <StatCard
            icon={Package}
            label="Pending"
            value={String(stats.pending)}
          />
          <StatCard
            icon={TrendingUp}
            label="Total revenue"
            value={`$${stats.revenue.toFixed(2)}`}
          />
        </div>

        <div className="mt-10">
          <h2 className="mb-4 font-serif text-2xl text-navy">Recent orders</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-left text-[10px] uppercase tracking-widest text-navy/60">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 20).map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-navy/70">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-navy/70">
                      {o.shippingName}
                    </td>
                    <td className="px-4 py-3 text-navy">
                      ${o.totalUsd.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-navy">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="p-6 text-center text-sm text-navy/60">No orders yet.</p>
            )}
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Icon className="size-5 text-gold" strokeWidth={1.5} />
      <p className="mt-2 text-[10px] uppercase tracking-widest text-navy/60">
        {label}
      </p>
      <p className="mt-1 font-serif text-3xl text-navy">{value}</p>
    </div>
  );
}