/**
 * The database now lives in Supabase (Postgres).
 *
 * Schema management is done with drizzle-kit against DATABASE_URL:
 *   bun x drizzle-kit push        # sync schema.ts to Supabase
 *   bun x drizzle-kit generate    # emit SQL migration files to ./drizzle
 *
 * The old local SQLite migration (data/hime.db) is retired.
 */
console.log(
  "Database moved to Supabase. Use `bun x drizzle-kit push` to sync the schema (DATABASE_URL in .env)."
);
