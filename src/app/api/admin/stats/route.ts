export const runtime = "nodejs";
import { db, schema } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { sql, desc } from "drizzle-orm";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Authentication required", 401);
  if (!user.email.endsWith("@hime.jewellery")) {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    // Date windows are computed by Postgres (now() - interval) — binding JS
    // Date objects into raw sql templates serializes them unparseably.

    const [orderStats] = await db
      .select({
        total: sql<number>`count(*)`.as("total"),
        pending: sql<number>`coalesce(sum(case when status = 'pending' then 1 else 0 end), 0)`.as("pending"),
        confirmed: sql<number>`coalesce(sum(case when status = 'confirmed' then 1 else 0 end), 0)`.as("confirmed"),
        inProduction: sql<number>`coalesce(sum(case when status = 'in_production' then 1 else 0 end), 0)`.as("inProduction"),
        shipped: sql<number>`coalesce(sum(case when status = 'shipped' then 1 else 0 end), 0)`.as("shipped"),
        delivered: sql<number>`coalesce(sum(case when status = 'delivered' then 1 else 0 end), 0)`.as("delivered"),
        cancelled: sql<number>`coalesce(sum(case when status = 'cancelled' then 1 else 0 end), 0)`.as("cancelled"),
        revenue7d: sql<number>`coalesce(sum(case when created_at >= now() - interval '7 days' then total_usd else 0 end), 0)`.as("revenue7d"),
        revenue30d: sql<number>`coalesce(sum(case when created_at >= now() - interval '30 days' then total_usd else 0 end), 0)`.as("revenue30d"),
        revenueTotal: sql<number>`coalesce(sum(total_usd), 0)`.as("revenueTotal"),
      })
      .from(schema.orders);

    const [userStats] = await db
      .select({
        total: sql<number>`count(*)`.as("total"),
        new7d: sql<number>`coalesce(sum(case when created_at >= now() - interval '7 days' then 1 else 0 end), 0)`.as("new7d"),
      })
      .from(schema.users);

    const [productStats] = await db
      .select({
        total: sql<number>`count(*)`.as("total"),
        active: sql<number>`coalesce(sum(case when is_active then 1 else 0 end), 0)`.as("active"),
        outOfStock: sql<number>`coalesce(sum(case when is_active and id in (select product_id from product_variants where stock_count = 0) then 1 else 0 end), 0)`.as("outOfStock"),
      })
      .from(schema.products);

    const [reviewStats] = await db
      .select({
        total: sql<number>`count(*)`.as("total"),
        pending: sql<number>`coalesce(sum(case when is_approved = false then 1 else 0 end), 0)`.as("pending"),
      })
      .from(schema.reviews);

    const salesRows = await db
      .select({
        day: sql<string>`to_char(created_at, 'YYYY-MM-DD')`.as("day"),
        orders: sql<number>`count(*)`.as("orders"),
        revenue: sql<number>`sum(total_usd)`.as("revenue"),
      })
      .from(schema.orders)
      .where(sql`created_at >= now() - interval '14 days'`)
      .groupBy(sql`to_char(created_at, 'YYYY-MM-DD')`)
      .orderBy(sql`day`);

    // Fill gaps so the chart always shows a continuous 14-day series.
    const salesSeries: { day: string; orders: number; revenue: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const row = salesRows.find((r) => r.day === key);
      salesSeries.push({
        day: key.slice(5),
        orders: row?.orders || 0,
        revenue: Math.round((row?.revenue || 0) * 100) / 100,
      });
    }

    const [aovRow] = await db
      .select({
        aov: sql<number>`case when count(*) = 0 then 0 else sum(total_usd) / count(*) end`.as("aov"),
      })
      .from(schema.orders);

    const recentOrders = await db
      .select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt))
      .limit(5);

    const topProducts = await db
      .select({
        productId: schema.orderItems.productId,
        productName: schema.orderItems.productName,
        sold: sql<number>`sum(${schema.orderItems.quantity})`.as("sold"),
        revenue: sql<number>`sum(${schema.orderItems.unitPriceUsd} * ${schema.orderItems.quantity})`.as("revenue"),
      })
      .from(schema.orderItems)
      .groupBy(schema.orderItems.productId, schema.orderItems.productName)
      .orderBy(desc(sql`sold`))
      .limit(5);

    return apiSuccess({
      orders: orderStats,
      users: userStats,
      products: productStats,
      reviews: reviewStats,
      recentOrders,
      topProducts,
      salesSeries,
      aov: Math.round((aovRow?.aov || 0) * 100) / 100,
    });
  } catch (err) {
    return handleApiError(err);
  }
}