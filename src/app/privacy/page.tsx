import { ShopLayout } from "@/components/shop-layout";

export const metadata = {
  title: "Privacy Policy — Lune",
};

export default function PrivacyPage() {
  return (
    <ShopLayout>
      <section className="container-wide py-12 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
              Legal
            </p>
            <h1 className="font-serif text-5xl text-navy">Privacy policy</h1>
            <p className="mt-2 text-sm text-navy/60">Last updated 1 March 2026</p>
          </header>

          <div className="space-y-6 text-sm leading-relaxed text-navy/80">
            <p>
              At Lune, we respect your privacy and are committed to protecting
              your personal data. This policy explains how we collect, use and
              safeguard your information when you visit our website or make a
              purchase.
            </p>

            <h2 className="font-serif text-2xl text-navy">Information we collect</h2>
            <p>
              We collect information you provide directly: name, email, phone
              number, shipping address, and payment information needed to
              process your order. We also collect basic analytics about how you
              use the site.
            </p>

            <h2 className="font-serif text-2xl text-navy">How we use your information</h2>
            <ul className="list-disc space-y-1.5 ps-5">
              <li>To process and ship your orders</li>
              <li>To send order updates via email and SMS</li>
              <li>To personalise your shopping experience</li>
              <li>To improve our products and services</li>
              <li>To send marketing communications (only with your consent)</li>
            </ul>

            <h2 className="font-serif text-2xl text-navy">Your rights</h2>
            <p>
              You have the right to access, correct or delete your personal
              data at any time. Contact us at{" "}
              <a href="mailto:privacy@lune.jewellery" className="text-gold hover:underline">
                privacy@lune.jewellery
              </a>{" "}
              to exercise these rights.
            </p>

            <h2 className="font-serif text-2xl text-navy">Data retention</h2>
            <p>
              We retain your order history for 7 years for tax and legal
              purposes. Marketing data is retained until you unsubscribe.
            </p>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}