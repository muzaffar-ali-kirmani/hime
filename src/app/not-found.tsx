import Link from "next/link";
import { ShopLayout } from "@/components/shop-layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <ShopLayout>
      <section className="container-wide py-32 text-center">
        <p className="font-serif text-8xl text-navy">404</p>
        <h1 className="mt-4 font-serif text-3xl text-navy">Page not found</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-navy/60">
          The page you're looking for might have moved or no longer exists.
        </p>
        <Button
          asChild
          className="mt-6 rounded-full bg-navy px-8 py-5 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
        >
          <Link href="/">Back home</Link>
        </Button>
      </section>
    </ShopLayout>
  );
}