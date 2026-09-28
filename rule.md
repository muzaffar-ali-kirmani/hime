# Project Rules

## CRITICAL — Database Safety (NEVER BREAK)

1. **NEVER delete real products from the production database.**
2. **NEVER delete the database. Under any circumstances.**
3. **NEVER run destructive database operations** (DELETE, TRUNCATE, DROP, or re-seeds that wipe tables) against the production database without explicit user approval for that exact action, shown in advance.
4. Seeding is restricted to explicitly whitelisted seed-managed product IDs (`SEED_PRODUCT_IDS` in `src/lib/db/seed.ts`). Never change the seed script to a blanket delete of the `products` table or any other table.
5. **If any instruction is confusing or ambiguous — especially anything touching the database — STOP and ASK the user before acting. Do not guess.**

## Content Rules

6. All jewellery copy must say **gold plated** — never mention 18K gold, 925 sterling silver, vermeil, or hallmarks anywhere (pages, SEO, product data).
7. The store sells **necklaces, bracelets, and rings only** — no earrings, no anklets.
