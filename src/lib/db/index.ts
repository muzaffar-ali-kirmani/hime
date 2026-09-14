import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://localhost:5432/postgres";

const globalForDb = globalThis as unknown as {
  __postgresClient?: postgres.Sql;
};

function createClient() {
  return postgres(connectionString, {
    // Supabase session pooler allows only ~15 clients total. Dev (HMR, multiple
    // route bundles) can instantiate this module several times, so cache one
    // shared pool on globalThis and keep max conservative.
    max: 5,
    idle_timeout: 20,
    connect_timeout: 15,
    max_lifetime: 60 * 30,
    ssl: "prefer",
    prepare: false,
  });
}

const client = globalForDb.__postgresClient ?? createClient();
globalForDb.__postgresClient = client;

export const db = drizzle(client, { schema });
export { schema };
