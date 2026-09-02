import { ShopLayout } from "@/components/shop-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "FAQ — Lune",
};

const FAQ_GROUPS = [
  {
    title: "Orders",
    items: [
      {
        q: "How long does it take to receive my order?",
        a: "In-stock pieces ship within 24 hours and arrive in 3–5 days across the Gulf. Made-to-order and engraved pieces are hand-finished in 5–7 days, then shipped.",
      },
      {
        q: "Can I edit or cancel my order after placing it?",
        a: "Yes — contact us within 12 hours of placing your order. Once production has started on a personalised piece, we can't make changes.",
      },
      {
        q: "Do you offer Cash on Delivery?",
        a: "Yes, COD is available for UAE, Saudi Arabia, Kuwait and Bahrain on orders under 500 USD.",
      },
    ],
  },
  {
    title: "Personalisation",
    items: [
      {
        q: "How many characters can I engrave?",
        a: "Most pieces support up to 12 characters including spaces. Signet rings support up to 2 letters. The character limit is shown next to each engraving field.",
      },
      {
        q: "Will the engraving fade over time?",
        a: "No. We deep-engrave each piece using a precision laser, then hand-finish the surface. The engraving is permanent.",
      },
      {
        q: "Can I see a preview before I order?",
        a: "Yes — our customizer shows a live preview of your engraving on the actual piece. You can also share your design with someone special before placing your order.",
      },
    ],
  },
  {
    title: "Shipping & Returns",
    items: [
      {
        q: "Do you ship across all GCC countries?",
        a: "Yes — we ship to UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman with free delivery on orders over 150 USD.",
      },
      {
        q: "What is your return policy?",
        a: "We offer 30-day free returns on non-personalised pieces. Personalised pieces can be exchanged within 14 days if unworn.",
      },
      {
        q: "Do I need to pay customs or duties?",
        a: "No — all duties are included in our prices for GCC countries.",
      },
    ],
  },
  {
    title: "Materials & Care",
    items: [
      {
        q: "Is your gold real?",
        a: "Yes. Our 18K pieces are solid 18K gold. Our gold vermeil pieces are 925 sterling silver coated with 2.5 microns of 18K gold — five times thicker than standard plating.",
      },
      {
        q: "Are your pieces hypoallergenic?",
        a: "Yes — all Lune pieces are nickel-free and hypoallergenic, kind to sensitive ears and skin.",
      },
      {
        q: "How do I care for my jewellery?",
        a: "Avoid contact with water, perfume and lotion. Store in the pouch provided. Polish gently with the included cloth.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <ShopLayout>
      <section className="container-wide py-12 lg:py-20">
        <header className="mb-10 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
            Help
          </p>
          <h1 className="font-serif text-5xl text-navy">Frequently asked</h1>
        </header>
        <div className="mx-auto max-w-3xl space-y-10">
          {FAQ_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 font-serif text-2xl text-navy">{group.title}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {group.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${group.title}-${i}`}
                    className="rounded-xl border border-border bg-card px-5"
                  >
                    <AccordionTrigger className="text-sm font-medium text-navy hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-navy/70">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>
    </ShopLayout>
  );
}