import { ShopLayout } from "@/components/shop-layout";
import { Truck, RefreshCcw, Globe, Clock } from "lucide-react";

export const metadata = {
  title: "Shipping & Returns — Lune",
};

export default function ShippingPage() {
  return (
    <ShopLayout>
      <section className="container-wide py-12 lg:py-20">
        <header className="mb-12 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
            Help
          </p>
          <h1 className="font-serif text-5xl text-navy">Shipping & Returns</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-navy/65">
            We deliver across all six GCC countries — fast, tracked, and
            duty-free. Free returns within 30 days on unworn pieces.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Truck,
              title: "Free Gulf shipping",
              text: "Complimentary delivery across UAE, KSA, Qatar, Kuwait, Bahrain and Oman on orders over 150 USD.",
            },
            {
              icon: Clock,
              title: "3–5 day delivery",
              text: "In-stock pieces arrive within 3–5 business days. Made-to-order in 5–7 days.",
            },
            {
              icon: Globe,
              title: "Duty-free",
              text: "All duties and taxes included in our prices — no surprise fees on delivery.",
            },
            {
              icon: RefreshCcw,
              title: "30-day returns",
              text: "Free returns on non-personalised pieces. 14-day exchange on personalised items.",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <b.icon className="size-7 text-gold" strokeWidth={1.2} />
              <h3 className="mt-4 font-serif text-xl text-navy">{b.title}</h3>
              <p className="mt-2 text-sm text-navy/65">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-8">
          <Section title="Delivery times by country">
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr className="text-left text-[11px] uppercase tracking-widest text-navy/60">
                    <th className="px-4 py-3">Country</th>
                    <th className="px-4 py-3">Standard</th>
                    <th className="px-4 py-3">Express</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["UAE", "1–2 days", "Same day"],
                    ["Saudi Arabia", "3–5 days", "1–2 days"],
                    ["Qatar", "3–5 days", "1–2 days"],
                    ["Kuwait", "3–5 days", "2 days"],
                    ["Bahrain", "3–5 days", "1–2 days"],
                    ["Oman", "3–5 days", "2 days"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-border">
                      {row.map((c, i) => (
                        <td key={i} className="px-4 py-3 text-navy">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Return policy">
            <ul className="space-y-2 text-sm text-navy/80">
              <li>• 30-day free returns on non-personalised pieces</li>
              <li>• 14-day exchange on personalised items if unworn</li>
              <li>• Items must be in their original packaging and condition</li>
              <li>• Refunds processed within 5 business days of receipt</li>
            </ul>
          </Section>

          <Section title="Order tracking">
            <p className="text-sm text-navy/80">
              Once your order is shipped, you'll receive a tracking link via
              email and SMS. You can also track it anytime from your{" "}
              <a href="/account/orders" className="text-gold hover:underline">
                account page
              </a>
              .
            </p>
          </Section>
        </div>
      </section>
    </ShopLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-3 font-serif text-2xl text-navy">{title}</h2>
      {children}
    </div>
  );
}