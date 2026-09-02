import { ShopLayout } from "@/components/shop-layout";

export const metadata = {
  title: "Terms of Service — Lune",
};

export default function TermsPage() {
  return (
    <ShopLayout>
      <section className="container-wide py-12 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
              Legal
            </p>
            <h1 className="font-serif text-5xl text-navy">Terms of service</h1>
            <p className="mt-2 text-sm text-navy/60">Last updated 1 March 2026</p>
          </header>

          <div className="space-y-6 text-sm leading-relaxed text-navy/80">
            <p>
              By using lune.jewellery you agree to the following terms. We may
              update these terms from time to time — we'll always notify you of
              material changes.
            </p>

            <h2 className="font-serif text-2xl text-navy">Orders & acceptance</h2>
            <p>
              All orders are subject to acceptance and availability. We reserve
              the right to refuse or cancel orders if pricing or stock errors
              are identified, in which case we'll notify you and refund any
              payment.
            </p>

            <h2 className="font-serif text-2xl text-navy">Pricing</h2>
            <p>
              All prices include VAT where applicable. Shipping is calculated
              at checkout. Currency conversion rates are refreshed daily.
            </p>

            <h2 className="font-serif text-2xl text-navy">Personalised pieces</h2>
            <p>
              Engraved and personalised pieces are made to order and cannot be
              refunded. They can be exchanged within 14 days if unworn.
            </p>

            <h2 className="font-serif text-2xl text-navy">Warranty</h2>
            <p>
              All Lune pieces come with a 1-year warranty against manufacturing
              defects. This does not cover wear and tear, accidental damage,
              or loss.
            </p>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}