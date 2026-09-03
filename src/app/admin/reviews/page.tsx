"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, CheckCircle, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/reviews", { credentials: "include" });
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setApproved(r: any, isApproved: boolean) {
    await fetch(`/api/admin/reviews/${r.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved }),
    });
    toast.success(isApproved ? "Review approved" : "Review hidden");
    load();
  }

  async function deleteReview(r: any) {
    if (!confirm(`Delete review by ${r.authorName}?`)) return;
    await fetch(`/api/admin/reviews/${r.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    toast.success("Review deleted");
    load();
  }

  const filtered = reviews.filter((r) =>
    filter === "all"
      ? true
      : filter === "pending"
      ? !r.isApproved
      : r.isApproved
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-navy sm:text-4xl">Reviews</h1>
        <p className="mt-1 text-sm text-navy/60">
          {reviews.length} total · {reviews.filter((r) => !r.isApproved).length}{" "}
          pending approval
        </p>
      </div>

      <div className="flex gap-2">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs capitalize",
              filter === f
                ? "border-navy bg-navy text-cream"
                : "border-border bg-card text-navy"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-navy/60">Loading…</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-navy">{r.authorName}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-3",
                            i < r.rating
                              ? "fill-gold stroke-gold"
                              : "stroke-navy/20"
                          )}
                        />
                      ))}
                    </div>
                    {!r.isApproved && (
                      <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[9px] uppercase tracking-widest text-navy">
                        Pending
                      </span>
                    )}
                    {r.isVerified && (
                      <span className="rounded-full bg-success/20 px-2 py-0.5 text-[9px] uppercase tracking-widest text-success">
                        Verified
                      </span>
                    )}
                  </div>
                  {r.title && (
                    <p className="mt-1 text-sm font-medium text-navy">
                      {r.title}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-navy/80">{r.body}</p>
                  <p className="mt-2 text-[10px] text-navy/50">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {r.isApproved ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setApproved(r, false)}
                      className="rounded-full text-xs"
                    >
                      <EyeOff className="me-1.5 size-3" /> Hide
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setApproved(r, true)}
                      className="rounded-full bg-success text-cream hover:bg-success/90"
                    >
                      <CheckCircle className="me-1.5 size-3" /> Approve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteReview(r)}
                    className="rounded-full text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-navy/60">
              No reviews found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}