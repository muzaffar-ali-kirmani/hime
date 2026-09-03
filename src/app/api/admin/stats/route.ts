export const runtime = "nodejs";
import { db, schema } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api";
import { getCurrentUser, AuthError } from "@/lib/auth";
import { sql, eq, desc, gte } from "drizzle-orm";

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
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [orderStats] = await db
      .select({
        total: sql<number>`count(*)`.as("total"),
        pending: sql<number>`sum(case when status = 'pending' then 1 else 0 end)`.as("pending"),
        confirmed: sql<number>`sum(case when status = 'confirmed' then 1 else 0 end)`.as("confirmed"),
        inProduction: sql<number>`sum(case when status = 'in_production' then 1 else 0 end)`.as("inProduction"),
        shipped: sql<number>`sum(case when status = 'shipped' then 1 else 0 end)`.as("shipped"),
        delivered: sql<number>`sum(case when status = 'delivered' then 1 else 0 end)`.as("delivered"),
        cancelled: sql<number>`sum(case when status = 'cancelled' then 1 else 0 end)`.as("cancelled"),
        revenue7d: sql<number>`sum(case when created_at >= ${sevenDaysAgo} then total_usd else 0 end)`.as("revenue7d"),
        revenue30d: sql<number>`sum(case when created_at >= ${thirtyDaysAgo} then total_usd else 0 end)`.as("revenue30d"),
        revenueTotal: sql<number>`sum(total_usd)`.as("revenueTotal"),
      })
      .from(schema.orders);

    const [userStats] = await db
      .select({
        total: sql<number>`count(*)`.as("total"),
        new7d: sql<number>`sum(case when created_at >= ${sevenDaysAgo} then 1 else 0 end)`.as("new7d"),
      })
      .from(schema.users);

    const [productStats] = await db
      .select({
        total: sql<number>`count(*)`.as("total"),
        active: sql<number>`sum(case when is_active = 1 then 1 else 0 end)`.as("active"),
        outOfStock: sql<number>`sum(case when is_active = 1 and id in (select product_id from product_variants where stock_count = 0) then 1 else 0 end)`.as("outOfStock"),
      })
      .from(schema.products);

    const [reviewStats] = await db
      .select({
        total: sql<number>`count(*)`.as("total"),
        pending: sql<number>`sum(case when is_approved = 0 then 1 else 0 end)`.as("pending"),
      })
      .from(schema.reviews);

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
    });
  } catch (err) {
    return handleApiError(err);
  }
}