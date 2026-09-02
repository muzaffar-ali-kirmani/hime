import Image from "next/image";

export function InstagramModule() {
  const items = Array.from({ length: 6 }).map((_, i) => i);
  return (
    <section className="container-wide py-12 sm:py-16">
      <div className="mb-8 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
          @lune.jewellery · Tag us to be featured
        </p>
        <h2 className="mt-2 font-serif text-3xl text-navy sm:text-4xl">
          #MadeForYou
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
        {items.map((i) => {
          const hue = (i * 53 + 30) % 360;
          return (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-secondary"
            >
              <Image
                src={`data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='hsl(${hue},45%25,90%25)'/%3E%3Cstop offset='1' stop-color='hsl(${(hue + 30) % 360},35%25,75%25)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23g)'/%3E%3Ccircle cx='100' cy='100' r='30' fill='%23F7F3EB' opacity='0.5'/%3E%3Ctext x='100' y='110' font-family='Cormorant Garamond' font-size='24' fill='%231D2A44' text-anchor='middle'%3E%26%23x2764%3B%3C/text%3E%3C/svg%3E`}
                alt={`Customer photo ${i + 1}`}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}