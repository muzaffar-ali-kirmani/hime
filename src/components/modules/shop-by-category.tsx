"use client";

import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/data";

export function ShopByCategoryModule() {
  return (
    <section className="container-wide py-16 sm:py-20">
      <div className="mb-10 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
          Shop by Category
        </p>
        <h2 className="mt-2 font-serif text-4xl text-navy sm:text-5xl">
          Find her something
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/shop/${c.id}`}
            className="group block"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
              <Image
                src={c.image}
                alt={c.name}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-center sm:p-4">
                <p className="font-serif text-lg text-cream sm:text-xl">
                  {c.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}