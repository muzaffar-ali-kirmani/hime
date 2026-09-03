async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  signup: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    country?: string;
  }) => request<{ user: any }>("/api/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    request<{ user: any }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => request<{ success: boolean }>("/api/auth/logout", { method: "POST" }),

  me: () => request<{ user: any | null }>("/api/auth/me"),

  // Products
  getProducts: (params?: Record<string, string | number | boolean>) => {
    const qs = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : "";
    return request<{ products: any[]; total: number }>(`/api/products${qs}`);
  },

  getProduct: (slug: string) =>
    request<{ product: any; reviews: any[] }>(`/api/products/${slug}`),

  getCategories: () =>
    request<{ categories: { category: string; count: number }[] }>("/api/categories"),

  // Orders
  createOrder: (data: any) =>
    request<{ orderId: string; orderNumber: string; total: number; currency: string }>(
      "/api/orders",
      { method: "POST", body: JSON.stringify(data) }
    ),

  getOrder: (orderNumber: string) =>
    request<{ order: any; items: any[] }>(`/api/orders/${orderNumber}`),

  getMyOrders: () => request<{ orders: any[] }>("/api/orders/list"),

  // Wishlist
  getWishlist: () => request<{ items: any[] }>("/api/wishlist"),

  addToWishlist: (productId: string) =>
    request<{ success: boolean }>("/api/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),

  removeFromWishlist: (productId: string) =>
    request<{ success: boolean }>(
      `/api/wishlist?productId=${encodeURIComponent(productId)}`,
      { method: "DELETE" }
    ),

  // Designs
  getDesigns: () => request<{ designs: any[] }>("/api/designs"),

  saveDesign: (data: { productId?: string | null; productName: string; config: Record<string, string> }) =>
    request<{ id: string }>("/api/designs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteDesign: (id: string) =>
    request<{ success: boolean }>(`/api/designs?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  // Reviews
  getReviews: (productId: string) =>
    request<{ reviews: any[] }>(`/api/reviews?productId=${productId}`),

  createReview: (data: {
    productId: string;
    rating: number;
    title?: string;
    body: string;
    authorName: string;
  }) =>
    request<{ id: string }>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Addresses
  getAddresses: () => request<{ addresses: any[] }>("/api/addresses"),

  createAddress: (data: any) =>
    request<{ id: string }>("/api/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteAddress: (id: string) =>
    request<{ success: boolean }>(`/api/addresses?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  // Promo
  validatePromo: (code: string, subtotalUsd: number) =>
    request<{ code: string; type: string; amount: number; discount: number; minOrderUsd: number }>(
      "/api/promo/validate",
      {
        method: "POST",
        body: JSON.stringify({ code, subtotalUsd }),
      }
    ),
};