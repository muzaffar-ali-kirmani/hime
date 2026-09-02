import { ShopLayout } from "@/components/shop-layout";
import { Ruler } from "lucide-react";

export const metadata = {
  title: "Size Guide — Lune",
};

export default function SizeGuidePage() {
  return (
    <ShopLayout>
      <section className="container-wide py-12 lg:py-20">
        <header className="mb-12 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
            Help
          </p>
          <h1 className="font-serif text-5xl text-navy">Size guide</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-navy/65">
            Find the perfect fit. Use our guides below or contact our team on
            WhatsApp for personal assistance.
          </p>
        </header>

        <div className="mx-auto max-w-4xl space-y-10">
          <SizeCard title="Ring sizing">
            <p className="text-sm text-navy/75">
              Measure the inside diameter of a ring that already fits her, then
              match it to the table below. For the most accurate measurement,
              visit a local jeweller.
            </p>
            <table className="mt-5 w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-widest text-navy/60">
                  <th className="py-2">GCC / US</th>
                  <th className="py-2">EU</th>
                  <th className="py-2">Diameter (mm)</th>
                  <th className="py-2">Circumference (mm)</th>
                </tr>
              </thead>
              <tbody className="text-navy">
                {[
                  ["5", "49", "15.7", "49.3"],
                  ["6", "52", "16.5", "51.8"],
                  ["7", "54", "17.3", "54.4"],
                  ["8", "57", "18.1", "56.9"],
                  ["9", "59", "19.0", "59.5"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-border/40">
                    {row.map((c, i) => (
                      <td key={i} className="py-2.5">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </SizeCard>

          <SizeCard title="Necklace & bracelet length">
            <p className="text-sm text-navy/75">
              Use a measuring tape around the neck or wrist where you'd like the
              piece to sit. Standard lengths:
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { cm: "40 cm", label: "Choker", note: "Sits close to the throat" },
                { cm: "45 cm", label: "Princess", note: "Most popular — sits below the collarbone" },
                { cm: "50 cm", label: "Matinee", note: "Sits mid-chest" },
                { cm: "55 cm", label: "Opera", note: "Sits below the chest" },
              ].map((s) => (
                <div
                  key={s.cm}
                  className="rounded-xl border border-border bg-cream/60 p-4"
                >
                  <p className="font-serif text-2xl text-navy">{s.cm}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-widest text-gold">
                    {s.label}
                  </p>
                  <p className="mt-2 text-xs text-navy/65">{s.note}</p>
                </div>
              ))}
            </div>
          </SizeCard>

          <SizeCard title="Bracelet sizing">
            <p className="text-sm text-navy/75">
              Measure your wrist just above the bone, then add 1–2 cm for a
              comfortable fit. Standard sizes:
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { cm: "16 cm", note: "Extra small wrist" },
                { cm: "18 cm", note: "Standard (most common)" },
                { cm: "20 cm", note: "Larger wrist" },
              ].map((s) => (
                <div
                  key={s.cm}
                  className="rounded-xl border border-border bg-cream/60 p-4"
                >
                  <p className="font-serif text-2xl text-navy">{s.cm}</p>
                  <p className="mt-2 text-xs text-navy/65">{s.note}</p>
                </div>
              ))}
            </div>
          </SizeCard>
        </div>
      </section>
    </ShopLayout>
  );
}

function SizeCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="mb-3 flex items-center gap-2">
        <Ruler className="size-4 text-gold" />
        <h2 className="font-serif text-2xl text-navy">{title}</h2>
      </div>
      {children}
    </div>
  );
}