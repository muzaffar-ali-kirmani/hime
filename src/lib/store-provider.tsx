"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { CartItem, SavedDesign, ProductVariant, Gemstone } from "./types";
import { getProduct } from "./data";

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
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lune-store");
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
      "lune-store",
      JSON.stringify({ cart, wishlist, savedDesigns, recentlyViewed })
    );
  }, [cart, wishlist, savedDesigns, recentlyViewed, hydrated]);

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

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const saveDesign = useCallback((design: SavedDesign) => {
    setSavedDesigns((prev) => [design, ...prev].slice(0, 20));
  }, []);

  const removeSavedDesign = useCallback((id: string) => {
    setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
  }, []);

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
  const product = getProduct(args.productSlug);
  if (!product) throw new Error("Product not found");
  return {
    productId: product.id,
    productSlug: product.slug,
    name: product.name,
    image: product.images[0],
    variant: args.variant,
    personalization: args.personalization,
    quantity: args.quantity,
    unitPrice: args.variant.price + (args.personalization?.gemstone ? 15 : 0),
  };
}

export type { Gemstone };