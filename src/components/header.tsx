"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useStore } from "@/lib/store-provider";
import { useLocale } from "@/lib/locale-provider";
import { LocaleSwitcher } from "./locale-switcher";
import { CATEGORIES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { cartCount, setCartOpen } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Shop by Category", href: "/shop" },
    { label: "New & Trending", href: "/collections/new" },
    { label: "Create Your Own", href: "/customize", highlight: true },
    { label: "Gifting", href: "/collections/gifting" },
    { label: "Sale", href: "/collections/sale" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-cream/95 backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-[0_1px_0_0_rgba(29,42,68,0.06)]" : ""
      }`}
    >
      <div className="container-wide flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-6">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[88vw] max-w-sm bg-cream p-0">
            <SheetHeader className="border-b border-border/50 p-5">
              <SheetTitle className="font-serif text-2xl text-navy">Lune</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between border-b border-border/40 py-3.5 text-base ${
                    item.highlight ? "text-gold" : "text-navy"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 space-y-1">
                <p className="px-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Categories
                </p>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop/${c.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm text-navy/80"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-serif text-2xl font-medium tracking-tight text-navy sm:text-3xl">
            Lune
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link relative ${item.highlight ? "text-gold" : ""}`}
            >
              {item.label}
              {item.highlight && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gold/40" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="hidden text-navy hover:bg-navy/5 sm:inline-flex"
          >
            <Search className="size-[18px]" />
          </Button>
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden text-navy hover:bg-navy/5 sm:inline-flex h-9 w-9 items-center justify-center rounded-md"
          >
            <User className="size-[18px]" />
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="hidden text-navy hover:bg-navy/5 sm:inline-flex h-9 w-9 items-center justify-center rounded-md"
          >
            <Heart className="size-[18px]" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCartOpen(true)}
            aria-label="Cart"
            className="relative text-navy hover:bg-navy/5"
          >
            <ShoppingBag className="size-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-navy">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile locale */}
      <div className="flex items-center justify-center border-t border-border/30 py-1.5 sm:hidden">
        <LocaleSwitcher compact />
      </div>
    </header>
  );
}