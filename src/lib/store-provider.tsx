"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { CartItem, SavedDesign, ProductVariant } from "./types";
import { api } from "./api-client";

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  savedDesigns: SavedDesign[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  saveDesign: (design: SavedDesign) => void;
  removeSavedDesign: (id: string) => void;
  recentlyViewed: string[];
  pushRecentlyViewed: (productId: string) => void;
  cartCount: number;
  cartSubtotal: number;
  isAuthenticated: boolean;
  user: { id: string; email: string; firstName: string; lastName: string } | null;
  refreshUser: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<StoreContextValue["user"]>(null);
  const userRef = useRef<StoreContextValue["user"]>(null);
  userRef.current = user;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hime-store");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCart(parsed.cart || []);
        setWishlist(parsed.wishlist || []);
        setSavedDesigns(parsed.savedDesigns || []);
        setRecentlyViewed(parsed.recentlyViewed || []);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      "hime-store",
      JSON.stringify({ cart, wishlist, savedDesigns, recentlyViewed })
    );
  }, [cart, wishlist, savedDesigns, recentlyViewed, hydrated]);

  const refreshUser = useCallback(async () => {
    try {
      const { user } = await api.me();
      setUser(user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const [{ items }, { designs }] = await Promise.all([
          api.getWishlist(),
          api.getDesigns(),
        ]);
        if (cancelled) return;
        if (items && Array.isArray(items)) {
          setWishlist(items.map((i: any) => i.productId));
        }
        if (designs && Array.isArray(designs)) {
          setSavedDesigns(
            designs.map((d: any) => ({
              id: d.id,
              productId: d.productId || "",
              productName: d.productName,
              config: typeof d.config === "string" ? JSON.parse(d.config) : d.config,
              createdAt: new Date(d.createdAt).getTime(),
            }))
          );
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const addToCart = useCallback((item: Omit<CartItem, "id">) => {
    const id = `${item.productId}-${item.variant.id}-${Date.now()}`;
    setCart((prev) => [...prev, { ...item, id }]);
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const wasIn = wishlist.includes(productId);
      setWishlist((prev) =>
        wasIn ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
      if (userRef.current) {
        try {
          if (wasIn) {
            await api.removeFromWishlist(productId);
          } else {
            await api.addToWishlist(productId);
          }
        } catch {}
      }
    },
    [wishlist]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const saveDesign = useCallback(
    async (design: SavedDesign) => {
      setSavedDesigns((prev) => [design, ...prev].slice(0, 20));
      if (userRef.current) {
        try {
          await api.saveDesign({
            productId: design.productId,
            productName: design.productName,
            config: design.config,
          });
        } catch {}
      }
    },
    []
  );

  const removeSavedDesign = useCallback(
    async (id: string) => {
      setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
      if (userRef.current) {
        try {
          await api.deleteDesign(id);
        } catch {}
      }
    },
    []
  );

  const pushRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  }, []);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        savedDesigns,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        saveDesign,
        removeSavedDesign,
        recentlyViewed,
        pushRecentlyViewed,
        cartCount,
        cartSubtotal,
        isAuthenticated: !!user,
        user,
        refreshUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function buildCartItem(args: {
  productSlug: string;
  variant: ProductVariant;
  quantity: number;
  personalization?: CartItem["personalization"];
}) {
  return {
    productId: args.productSlug,
    productSlug: args.productSlug,
    name: args.productSlug,
    image: "",
    variant: args.variant,
    personalization: args.personalization,
    quantity: args.quantity,
    unitPrice: args.variant.price + (args.personalization?.gemstone ? 15 : 0),
  };
}