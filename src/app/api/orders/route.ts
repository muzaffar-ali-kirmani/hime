import { z } from "zod";
import { db, schema } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { apiError, apiSuccess, generateId, generateOrderNumber, handleApiError } from "@/lib/api";
import { eq } from "drizzle-orm";

const orderItemSchema = z.object({
  productId: z.string().nullable(),
  productSlug: z.string().optional(),
  productName: z.string(),
  productImage: z.string(),
  variantId: z.string(),
  metal: z.string(),
  lengthCm: z.number().nullable().optional(),
  size: z.string().nullable().optional(),
  unitPriceUsd: z.number().min(0),
  quantity: z.number().int().min(1).max(99),
  engravingText: z.string().nullable().optional(),
  gemstone: z.string().nullable().optional(),
  charmIds: z.array(z.string()).nullable().optional(),
});

const checkoutSchema = z.object({
  email: z.string().email(),
  items: z.array(orderItemSchema).min(1),
  shippingName: z.string().min(1),
  shippingPhone: z.string().min(5),
  shippingAddress1: z.string().min(1),
  shippingAddress2: z.string().optional(),
  shippingCity: z.string().min(1),
  shippingArea: z.string().optional(),
  shippingCountry: z.string().length(2),
  shippingNotes: z.string().optional(),
  paymentMethod: z.enum(["card", "apple", "tabby", "tamara", "cod"]),
  currency: z.string().default("AED"),
  promoCode: z.string().optional(),
  giftWrap: z.boolean().default(false),
  giftNote: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = checkoutSchema.parse(body);

    const user = await getCurrentUser();
    if (user && user.email !== data.email) {
      return apiError("Email does not match signed-in account", 400);
    }

    const subtotalUsd = data.items.reduce(
      (sum, item) => sum + item.unitPriceUsd * item.quantity,
      0
    );

    const FREE_SHIPPING_THRESHOLD = 150;
    const shippingUsd = subtotalUsd >= FREE_SHIPPING_THRESHOLD ? 0 : 9;
    const taxUsd = subtotalUsd * 0.05;
    const giftWrapUsd = data.giftWrap ? 8 : 0;

    let promoDiscount = 0;
    if (data.promoCode) {
      const promo = await db
        .select()
        .from(schema.promoCodes)
        .where(eq(schema.promoCodes.code, data.promoCode.toUpperCase()))
        .limit(1);

      if (promo.length > 0 && promo[0].isActive) {
        const p = promo[0];
        if (subtotalUsd >= p.minOrderUsd) {
          promoDiscount = p.type === "percent"
            ? subtotalUsd * (p.amount / 100)
            : p.amount;
        }
      }
    }

    const totalUsd = subtotalUsd + shippingUsd + taxUsd + giftWrapUsd - promoDiscount;

    const orderId = generateId("ord");
    const orderNumber = generateOrderNumber();

    await db.insert(schema.orders).values({
      id: orderId,
      orderNumber,
      userId: user?.id || null,
      guestEmail: user ? null : data.email,
      status: "pending",
      paymentStatus: data.paymentMethod === "cod" ? "pending" : "pending",
      paymentMethod: data.paymentMethod,
      currency: data.currency,
      subtotalUsd,
      shippingUsd,
      taxUsd,
      totalUsd,
      promoCode: data.promoCode?.toUpperCase() || null,
      promoDiscount,
      giftWrap: data.giftWrap,
      giftNote: data.giftNote || null,
      shippingName: data.shippingName,
      shippingPhone: data.shippingPhone,
      shippingAddress1: data.shippingAddress1,
      shippingAddress2: data.shippingAddress2 || null,
      shippingCity: data.shippingCity,
      shippingArea: data.shippingArea || null,
      shippingCountry: data.shippingCountry,
      shippingNotes: data.shippingNotes || null,
    });

    for (const item of data.items) {
      await db.insert(schema.orderItems).values({
        id: generateId("itm"),
        orderId,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        variantId: item.variantId,
        metal: item.metal,
        lengthCm: item.lengthCm || null,
        size: item.size || null,
        unitPriceUsd: item.unitPriceUsd,
        quantity: item.quantity,
        engravingText: item.engravingText || null,
        gemstone: item.gemstone || null,
        charmIds: item.charmIds || null,
      });

      // Decrement stock
      if (item.productId && !item.productId.startsWith("custom-")) {
        const variant = await db
          .select()
          .from(schema.productVariants)
          .where(eq(schema.productVariants.id, item.variantId))
          .limit(1);
        if (variant.length > 0) {
          await db
            .update(schema.productVariants)
            .set({
              stockCount: Math.max(0, variant[0].stockCount - item.quantity),
              inStock: variant[0].stockCount - item.quantity > 0,
            })
            .where(eq(schema.productVariants.id, item.variantId));
        }
      }
    }

    return apiSuccess(
      {
        orderId,
        orderNumber,
        total: totalUsd,
        currency: data.currency,
        status: "pending",
      },
      201
    );
  } catch (err) {
    return handleApiError(err);
  }
}