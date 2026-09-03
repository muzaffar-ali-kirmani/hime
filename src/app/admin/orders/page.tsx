"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  X,
  Save,
  Truck,
  Check,
  Package,
  Hammer,
  MapPin,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/lib/locale-provider";
import { formatPrice, COUNTRIES } from "@/lib/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUSES = [
  { id: "pending", label: "Pending", color: "bg-gold" },
  { id: "confirmed", label: "Confirmed", color: "bg-navy" },
  { id: "in_production", label: "In production", color: "bg-navy/70" },
  { id: "shipped", label: "Shipped", color: "bg-success" },
  { id: "delivered", label: "Delivered", color: "bg-success/70" },
  { id: "cancelled", label: "Cancelled", color: "bg-destructive" },
  { id: "returned", label: "Returned", color: "bg-secondary" },
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

function AdminOrdersPage() {
  const { currency, language } = useLocale();
  const params = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>(params.get("status") || "");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [detail, setDetail] = useState<{ order: any; items: any[] } | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadOrders() {
    setLoading(true);
    const qs = new URLSearchParams();
    if (statusFilter) qs.set("status", statusFilter);
    if (search) qs.set("q", search);
    const res = await fetch(`/api/admin/orders?${qs}`, { credentials: "include" });
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function openDetail(o: any) {
    setSelected(o);
    const res = await fetch(`/api/admin/orders/${o.id}`, { credentials: "include" });
    const data = await res.json();
    setDetail(data);
  }

  async function saveDetail() {
    if (!detail) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${detail.order.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: detail.order.status,
          paymentStatus: detail.order.paymentStatus,
          trackingNumber: detail.order.trackingNumber,
          adminNotes: detail.order.adminNotes,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Order updated");
      await loadOrders();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(s) ||
      o.shippingName.toLowerCase().includes(s) ||
      (o.shippingEmail || o.guestEmail || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl text-navy sm:text-4xl">Orders</h1>
          <p className="mt-1 text-sm text-navy/60">
            {orders.length} total orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order, customer, email…"
            className="h-10 rounded-full pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs",
              !statusFilter
                ? "border-navy bg-navy text-cream"
                : "border-border bg-card text-navy"
            )}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs",
                statusFilter === s.id
                  ? "border-navy bg-navy text-cream"
                  : "border-border bg-card text-navy"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-navy/60">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-[10px] uppercase tracking-widest text-navy/60">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-cream/30">
                  <td className="px-4 py-3 font-mono text-xs">
                    {o.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-navy/70">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-navy/80">
                    {o.shippingName}
                    {o.shippingEmail && (
                      <span className="block text-[10px] text-navy/50">
                        {o.shippingEmail}
                      </span>
                    )}
                    {!o.shippingEmail && o.guestEmail && (
                      <span className="block text-[10px] text-navy/50">
                        {o.guestEmail}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-navy/70">{o.giftWrap ? "🎁" : "—"}</td>
                  <td className="px-4 py-3 text-navy">
                    {formatPrice(o.totalUsd, currency, language)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] uppercase tracking-widest text-navy/60">
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetail(o)}
                      className="rounded-full text-xs"
                    >
                      Open
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-navy/60"
                  >
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {detail && (
        <OrderDetailDrawer
          detail={detail}
          setDetail={setDetail}
          onClose={() => {
            setDetail(null);
            setSelected(null);
          }}
          onSave={saveDetail}
          saving={saving}
        />
      )}
    </div>
  );
}

function OrderDetailDrawer({
  detail,
  setDetail,
  onClose,
  onSave,
  saving,
}: {
  detail: { order: any; items: any[] };
  setDetail: (d: any) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const { currency, language } = useLocale();
  const order = detail.order;
  const items = detail.items;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <div
        className="absolute inset-0 bg-navy/40"
        onClick={onClose}
      />
      <div className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-cream">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-cream px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-navy/60">
              Order
            </p>
            <h2 className="font-serif text-2xl text-navy">{order.orderNumber}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-navy/5">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Status update */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-navy">
              <Package className="size-4 text-gold" /> Update status
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Order status</Label>
                <select
                  value={order.status}
                  onChange={(e) =>
                    setDetail({ ...detail, order: { ...order, status: e.target.value } })
                  }
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Payment status</Label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      order: { ...order, paymentStatus: e.target.value },
                    })
                  }
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label>Tracking number</Label>
                <Input
                  value={order.trackingNumber || ""}
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      order: { ...order, trackingNumber: e.target.value },
                    })
                  }
                  placeholder="DHL / Aramex tracking ID"
                  className="mt-1 h-10 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Admin notes (private)</Label>
                <Textarea
                  value={order.adminNotes || ""}
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      order: { ...order, adminNotes: e.target.value },
                    })
                  }
                  rows={3}
                  placeholder="Internal notes — won't be shown to the customer"
                  className="mt-1 rounded-lg"
                />
              </div>
            </div>
            <Button
              onClick={onSave}
              disabled={saving}
              className="mt-4 w-full rounded-full bg-navy text-cream hover:bg-navy/90"
            >
              <Save className="me-2 size-4" />
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>

          {/* Customer + shipping */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-navy">
              <MapPin className="size-4 text-gold" /> Customer & shipping
            </h3>
            <div className="space-y-1 text-sm text-navy">
              <p className="font-medium">{order.shippingName}</p>
              {order.shippingEmail && (
                <p className="text-navy/70">{order.shippingEmail}</p>
              )}
              <p className="text-navy/70">{order.shippingPhone}</p>
              <p className="text-navy/70">
                {order.shippingAddress1}
                {order.shippingAddress2 ? `, ${order.shippingAddress2}` : ""}
                <br />
                {order.shippingArea ? `${order.shippingArea}, ` : ""}
                {order.shippingCity},{" "}
                {COUNTRIES[order.shippingCountry as keyof typeof COUNTRIES]?.name ||
                  order.shippingCountry}
              </p>
              {order.shippingNotes && (
                <p className="mt-2 rounded-lg bg-cream/40 p-2 text-xs italic text-navy/60">
                  Note: {order.shippingNotes}
                </p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-navy">
              <Hammer className="size-4 text-gold" /> Items ({items.length})
            </h3>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg bg-cream/40 p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">
                      {item.productName}{" "}
                      <span className="text-navy/60">×{item.quantity}</span>
                    </p>
                    <p className="text-xs capitalize text-navy/60">
                      {item.metal.replace("-", " ")}
                      {item.lengthCm && ` · ${item.lengthCm}cm`}
                      {item.size && ` · Size ${item.size}`}
                    </p>
                    {item.engravingText && (
                      <p className="mt-1 text-xs italic text-gold">
                        Engraved: "{item.engravingText}"
                      </p>
                    )}
                    {item.gemstone && (
                      <p className="text-xs text-navy/60">
                        Stone: {item.gemstone}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-navy">
                    {formatPrice(
                      item.unitPriceUsd * item.quantity,
                      currency,
                      language
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment + totals */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-navy">
              <CreditCard className="size-4 text-gold" /> Payment
            </h3>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-navy/70">
                <dt>Method</dt>
                <dd className="capitalize">{order.paymentMethod}</dd>
              </div>
              <div className="flex justify-between text-navy/70">
                <dt>Subtotal</dt>
                <dd>{formatPrice(order.subtotalUsd, currency, language)}</dd>
              </div>
              <div className="flex justify-between text-navy/70">
                <dt>Shipping</dt>
                <dd>
                  {order.shippingUsd === 0
                    ? "Free"
                    : formatPrice(order.shippingUsd, currency, language)}
                </dd>
              </div>
              <div className="flex justify-between text-navy/70">
                <dt>Tax</dt>
                <dd>{formatPrice(order.taxUsd, currency, language)}</dd>
              </div>
              {order.promoDiscount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Promo ({order.promoCode})</dt>
                  <dd>-{formatPrice(order.promoDiscount, currency, language)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 font-serif text-lg">
                <dt>Total</dt>
                <dd>{formatPrice(order.totalUsd, currency, language)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-medium uppercase tracking-widest text-navy/60">
      {children}
    </label>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = STATUSES.find((x) => x.id === status);
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest",
        s?.color || "bg-secondary",
        "text-cream"
      )}
    >
      {s?.label || status}
    </span>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-navy/60">Loading…</p>}>
      <AdminOrdersPage />
    </Suspense>
  );
}