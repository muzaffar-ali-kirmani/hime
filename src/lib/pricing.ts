// Cart-wide bulk discount: buying 2 or more items in total (across any
// products) gets 20% off the whole order.
export const BULK_DISCOUNT_MIN_ITEMS = 2;
export const BULK_DISCOUNT_RATE = 0.2;

/** Total quantity across a set of lines. */
export function totalQuantity(lines: { quantity: number }[]) {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

/** Discount amount (USD) when the cart/order has 2+ items in total. */
export function bulkDiscountForCart(lines: { unitPrice: number; quantity: number }[]) {
  if (totalQuantity(lines) < BULK_DISCOUNT_MIN_ITEMS) return 0;
  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  return total * BULK_DISCOUNT_RATE;
}